// VLSM Calculator Utility Functions

export function calculateBlockSize(hostsRequired) {
  // Ajouter 2 pour l'adresse réseau et broadcast
  const totalAddresses = hostsRequired + 2;
  
  // Trouver la puissance de 2 suivante
  let blockSize = 1;
  while (blockSize < totalAddresses) {
    blockSize *= 2;
  }
  
  return blockSize;
}

export function calculatePrefix(blockSize) {
  // Calculer le nombre de bits d'hôte nécessaires
  const hostBits = Math.log2(blockSize);
  
  // Préfixe = 32 - bits d'hôte
  return 32 - hostBits;
}

export function calculateSubnetAddresses(networkAddress, blockSize) {
  const parts = networkAddress.split('.').map(Number);
  
  // Première adresse hôte = adresse réseau + 1
  const firstHost = [...parts];
  firstHost[3] += 1;
  
  // Adresse broadcast = adresse réseau + taille du bloc - 1
  const broadcast = [...parts];
  let carry = blockSize - 1;
  for (let i = 3; i >= 0 && carry > 0; i--) {
    broadcast[i] += carry;
    if (broadcast[i] > 255) {
      carry = Math.floor(broadcast[i] / 256);
      broadcast[i] = broadcast[i] % 256;
    } else {
      carry = 0;
    }
  }
  
  // Dernière adresse hôte = broadcast - 1
  const lastHost = [...broadcast];
  lastHost[3] -= 1;
  
  return {
    network: parts.join('.'),
    firstHost: firstHost.join('.'),
    lastHost: lastHost.join('.'),
    broadcast: broadcast.join('.')
  };
}

export function calculateNextNetwork(currentNetwork, blockSize) {
  const parts = currentNetwork.split('.').map(Number);
  
  // Ajouter la taille du bloc à l'adresse réseau
  let carry = blockSize;
  for (let i = 3; i >= 0 && carry > 0; i--) {
    parts[i] += carry;
    if (parts[i] > 255) {
      carry = Math.floor(parts[i] / 256);
      parts[i] = parts[i] % 256;
    } else {
      carry = 0;
    }
  }
  
  return parts.join('.');
}

export function calculateVLSM(lanRequirements, wanLinks, baseNetwork = '192.168.1.0') {
  // Trier par nombre d'hôtes décroissant
  const sortedLans = [...lanRequirements].sort((a, b) => b.hosts - a.hosts);
  const sortedWans = [...wanLinks].sort((a, b) => b.hosts - a.hosts);
  
  const results = {
    planning: [],
    lanSubnets: [],
    wanSubnets: []
  };
  
  let currentNetwork = baseNetwork;
  
  // Calculer pour les LAN
  for (const lan of sortedLans) {
    const blockSize = calculateBlockSize(lan.hosts);
    const prefix = calculatePrefix(blockSize);
    const addresses = calculateSubnetAddresses(currentNetwork, blockSize);
    const usableHosts = blockSize - 2;
    
    // Tableau de planification
    results.planning.push({
      name: `${lan.router} ${lan.interface}`,
      hostsRequired: lan.hosts,
      blockSize: blockSize,
      prefix: `/${prefix}`,
      notes: `LAN - ${usableHosts} hôtes utilisables`
    });
    
    // Sous-réseaux LAN
    results.lanSubnets.push({
      interface: `${lan.router} ${lan.interface}`,
      hostsRequired: lan.hosts,
      prefix: `/${prefix}`,
      networkAddress: addresses.network,
      firstHost: addresses.firstHost,
      lastHost: addresses.lastHost,
      broadcast: addresses.broadcast,
      usableHosts: usableHosts
    });
    
    // Prochaine adresse réseau
    currentNetwork = calculateNextNetwork(currentNetwork, blockSize);
  }
  
  // Calculer pour les WAN
  for (const wan of sortedWans) {
    const blockSize = calculateBlockSize(wan.hosts);
    const prefix = calculatePrefix(blockSize);
    const addresses = calculateSubnetAddresses(currentNetwork, blockSize);
    
    // Tableau de planification (une seule entrée pour tous les WAN s'ils ont le même nombre d'hôtes)
    const existingWanPlanning = results.planning.find(p => p.name === 'Liens WAN');
    if (!existingWanPlanning) {
      results.planning.push({
        name: 'Liens WAN',
        hostsRequired: wan.hosts,
        blockSize: blockSize,
        prefix: `/${prefix}`,
        notes: `Point-à-point - ${blockSize - 2} hôtes utilisables`
      });
    }
    
    // Sous-réseaux WAN
    results.wanSubnets.push({
      linkName: `${wan.routerA} ${wan.interfaceA} – ${wan.routerB} ${wan.interfaceB}`,
      hostsRequired: wan.hosts,
      prefix: `/${prefix}`,
      networkAddress: addresses.network,
      routerAIP: addresses.firstHost,
      routerBIP: addresses.lastHost,
      broadcast: addresses.broadcast
    });
    
    // Prochaine adresse réseau
    currentNetwork = calculateNextNetwork(currentNetwork, blockSize);
  }
  
  return results;
}

export function maskToPrefix(mask) {
  const octets = mask.split('.').map(Number);
  let prefix = 0;
  for (const octet of octets) {
    prefix += (octet >>> 0).toString(2).split('1').length - 1;
  }
  return prefix;
}

export function prefixToMask(prefix) {
  const mask = [];
  for (let i = 0; i < 4; i++) {
    const bits = Math.min(8, Math.max(0, prefix - i * 8));
    mask.push(256 - Math.pow(2, 8 - bits));
  }
  return mask.join('.');
}