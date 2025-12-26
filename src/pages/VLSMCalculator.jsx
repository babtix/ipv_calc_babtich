import { useState } from 'react';
import { calculateVLSM } from '../utils/vlsmCalculator';
import './Calculator.css';
import './VLSM.css';

function VLSMCalculator() {
  const [routers, setRouters] = useState(['BR0', 'BR1', 'BR2']);
  const [lanRequirements, setLanRequirements] = useState([
    { router: 'BR0', interface: 'G0/0', hosts: 16000 },
    { router: 'BR0', interface: 'G0/1', hosts: 8000 },
    { router: 'BR1', interface: 'G0/0', hosts: 2000 },
    { router: 'BR1', interface: 'G0/1', hosts: 4000 },
    { router: 'BR2', interface: 'G0/0', hosts: 500 },
    { router: 'BR2', interface: 'G0/1', hosts: 1000 }
  ]);
  const [wanLinks, setWanLinks] = useState([
    { routerA: 'BR1', interfaceA: 'S0/0/0', routerB: 'BR0', interfaceB: 'S0/0/0', hosts: 2 },
    { routerA: 'BR1', interfaceA: 'S0/0/1', routerB: 'BR2', interfaceB: 'S0/0/1', hosts: 2 },
    { routerA: 'BR0', interfaceA: 'S0/0/1', routerB: 'BR2', interfaceB: 'S0/0/0', hosts: 2 }
  ]);
  const [showTables, setShowTables] = useState(false);
  const [baseNetwork, setBaseNetwork] = useState('192.168.1.0');
  const [vlsmResults, setVlsmResults] = useState(null);

  const addRouter = () => {
    const newRouter = `R${routers.length}`;
    setRouters([...routers, newRouter]);
  };

  const removeRouter = (index) => {
    const routerToRemove = routers[index];
    setRouters(routers.filter((_, i) => i !== index));
    setLanRequirements(lanRequirements.filter(lan => lan.router !== routerToRemove));
    setWanLinks(wanLinks.filter(wan => wan.routerA !== routerToRemove && wan.routerB !== routerToRemove));
  };

  const updateRouter = (index, newName) => {
    const oldName = routers[index];
    const newRouters = [...routers];
    newRouters[index] = newName;
    setRouters(newRouters);
    
    // Update LAN requirements
    setLanRequirements(lanRequirements.map(lan => 
      lan.router === oldName ? { ...lan, router: newName } : lan
    ));
    
    // Update WAN links
    setWanLinks(wanLinks.map(wan => ({
      ...wan,
      routerA: wan.routerA === oldName ? newName : wan.routerA,
      routerB: wan.routerB === oldName ? newName : wan.routerB
    })));
  };

  const addLanRequirement = () => {
    setLanRequirements([...lanRequirements, {
      router: routers[0] || 'R0',
      interface: 'G0/0',
      hosts: 100
    }]);
  };

  const removeLanRequirement = (index) => {
    setLanRequirements(lanRequirements.filter((_, i) => i !== index));
  };

  const updateLanRequirement = (index, field, value) => {
    const newLanRequirements = [...lanRequirements];
    newLanRequirements[index] = { ...newLanRequirements[index], [field]: value };
    setLanRequirements(newLanRequirements);
  };

  const addWanLink = () => {
    setWanLinks([...wanLinks, {
      routerA: routers[0] || 'R0',
      interfaceA: 'S0/0/0',
      routerB: routers[1] || 'R1',
      interfaceB: 'S0/0/0',
      hosts: 2
    }]);
  };

  const removeWanLink = (index) => {
    setWanLinks(wanLinks.filter((_, i) => i !== index));
  };

  const updateWanLink = (index, field, value) => {
    const newWanLinks = [...wanLinks];
    newWanLinks[index] = { ...newWanLinks[index], [field]: value };
    setWanLinks(newWanLinks);
  };

  const generateTables = () => {
    const results = calculateVLSM(lanRequirements, wanLinks, baseNetwork);
    setVlsmResults(results);
    setShowTables(true);
  };

  const sortedLanRequirements = [...lanRequirements].sort((a, b) => b.hosts - a.hosts);

  return (
    <div className="calculator-page">
      <div className="calculator-header">
        <h1>Calculateur VLSM</h1>
        <p>Personnalisez votre topologie et générez des tableaux de planification VLSM</p>
      </div>

      <div className="input-section">
        <div className="vlsm-config">
          <h3>Configuration de la topologie</h3>
          
          {/* Routeurs */}
          <div className="config-section">
            <h4>Routeurs</h4>
            <div className="router-list">
              {routers.map((router, index) => (
                <div key={index} className="router-item">
                  <input
                    type="text"
                    value={router}
                    onChange={(e) => updateRouter(index, e.target.value)}
                    className="router-input"
                  />
                  <button 
                    onClick={() => removeRouter(index)}
                    className="remove-btn"
                    disabled={routers.length <= 1}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button onClick={addRouter} className="add-btn">+ Ajouter routeur</button>
            </div>
          </div>

          {/* Exigences LAN */}
          <div className="config-section">
            <h4>Exigences LAN</h4>
            <div className="lan-list">
              {lanRequirements.map((lan, index) => (
                <div key={index} className="lan-item">
                  <select
                    value={lan.router}
                    onChange={(e) => updateLanRequirement(index, 'router', e.target.value)}
                    className="lan-select"
                  >
                    {routers.map(router => (
                      <option key={router} value={router}>{router}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={lan.interface}
                    onChange={(e) => updateLanRequirement(index, 'interface', e.target.value)}
                    className="interface-input"
                    placeholder="G0/0"
                  />
                  <input
                    type="number"
                    value={lan.hosts}
                    onChange={(e) => updateLanRequirement(index, 'hosts', parseInt(e.target.value) || 0)}
                    className="hosts-input"
                    placeholder="Hôtes"
                  />
                  <span className="hosts-label">hôtes</span>
                  <button 
                    onClick={() => removeLanRequirement(index)}
                    className="remove-btn"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button onClick={addLanRequirement} className="add-btn">+ Ajouter LAN</button>
            </div>
          </div>

          {/* Liens WAN */}
          <div className="config-section">
            <h4>Liens WAN série</h4>
            <div className="wan-list">
              {wanLinks.map((wan, index) => (
                <div key={index} className="wan-item">
                  <select
                    value={wan.routerA}
                    onChange={(e) => updateWanLink(index, 'routerA', e.target.value)}
                    className="wan-select"
                  >
                    {routers.map(router => (
                      <option key={router} value={router}>{router}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={wan.interfaceA}
                    onChange={(e) => updateWanLink(index, 'interfaceA', e.target.value)}
                    className="interface-input"
                    placeholder="S0/0/0"
                  />
                  <span className="wan-separator">–</span>
                  <select
                    value={wan.routerB}
                    onChange={(e) => updateWanLink(index, 'routerB', e.target.value)}
                    className="wan-select"
                  >
                    {routers.map(router => (
                      <option key={router} value={router}>{router}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={wan.interfaceB}
                    onChange={(e) => updateWanLink(index, 'interfaceB', e.target.value)}
                    className="interface-input"
                    placeholder="S0/0/0"
                  />
                  <input
                    type="number"
                    value={wan.hosts}
                    onChange={(e) => updateWanLink(index, 'hosts', parseInt(e.target.value) || 2)}
                    className="hosts-input-small"
                    min="2"
                  />
                  <span className="hosts-label">hôtes</span>
                  <button 
                    onClick={() => removeWanLink(index)}
                    className="remove-btn"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button onClick={addWanLink} className="add-btn">+ Ajouter lien WAN</button>
            </div>
          </div>

          {/* Réseau de base */}
          <div className="config-section">
            <h4>Réseau de base</h4>
            <div className="base-network">
              <input
                type="text"
                value={baseNetwork}
                onChange={(e) => setBaseNetwork(e.target.value)}
                className="base-network-input"
                placeholder="192.168.1.0"
              />
              <span className="base-network-label">Adresse réseau de départ</span>
            </div>
          </div>
        </div>

        <button onClick={generateTables} className="calculate-btn">
          Calculer et générer les tableaux VLSM
        </button>
      </div>

      {showTables && vlsmResults && (
        <div className="vlsm-tables">
          <div className="topology-summary">
            <h3>Résumé de la topologie</h3>
            <p><strong>Routeurs :</strong> {routers.join(', ')}</p>
            <p><strong>Interfaces LAN :</strong> {lanRequirements.length}</p>
            <p><strong>Liens WAN :</strong> {wanLinks.length}</p>
            <p><strong>Réseau de base :</strong> {baseNetwork}</p>
          </div>

          <div className="table-section">
            <h3>Tableau de planification VLSM</h3>
            <div className="table-container">
              <table className="vlsm-table">
                <thead>
                  <tr>
                    <th>Nom du sous-réseau</th>
                    <th>Hôtes requis</th>
                    <th>Taille du bloc</th>
                    <th>Préfixe nécessaire</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {vlsmResults.planning.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.hostsRequired.toLocaleString('fr-FR')}</td>
                      <td>{item.blockSize}</td>
                      <td>{item.prefix}</td>
                      <td>{item.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="table-section">
            <h3>Sous-réseaux LAN</h3>
            <div className="table-container">
              <table className="vlsm-table">
                <thead>
                  <tr>
                    <th>LAN / Interface</th>
                    <th>Hôtes requis</th>
                    <th>Préfixe choisi</th>
                    <th>Adresse réseau</th>
                    <th>Première adresse hôte</th>
                    <th>Dernière adresse hôte</th>
                    <th>Adresse broadcast</th>
                    <th>Nombre d'hôtes utilisables</th>
                  </tr>
                </thead>
                <tbody>
                  {vlsmResults.lanSubnets.map((lan, index) => (
                    <tr key={index}>
                      <td>{lan.interface}</td>
                      <td>{lan.hostsRequired.toLocaleString('fr-FR')}</td>
                      <td>{lan.prefix}</td>
                      <td>{lan.networkAddress}</td>
                      <td>{lan.firstHost}</td>
                      <td>{lan.lastHost}</td>
                      <td>{lan.broadcast}</td>
                      <td>{lan.usableHosts.toLocaleString('fr-FR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="table-section">
            <h3>Sous-réseaux WAN</h3>
            <div className="table-container">
              <table className="vlsm-table">
                <thead>
                  <tr>
                    <th>Nom du lien</th>
                    <th>Hôtes requis</th>
                    <th>Préfixe choisi</th>
                    <th>Adresse réseau</th>
                    <th>IP Routeur A</th>
                    <th>IP Routeur B</th>
                    <th>Adresse broadcast</th>
                  </tr>
                </thead>
                <tbody>
                  {vlsmResults.wanSubnets.map((wan, index) => (
                    <tr key={index}>
                      <td>{wan.linkName}</td>
                      <td>{wan.hostsRequired}</td>
                      <td>{wan.prefix}</td>
                      <td>{wan.networkAddress}</td>
                      <td>{wan.routerAIP}</td>
                      <td>{wan.routerBIP}</td>
                      <td>{wan.broadcast}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="calculation-summary">
            <h3>Résumé des calculs</h3>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-label">Total sous-réseaux LAN :</span>
                <span className="summary-value">{vlsmResults.lanSubnets.length}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Total liens WAN :</span>
                <span className="summary-value">{vlsmResults.wanSubnets.length}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Total hôtes LAN :</span>
                <span className="summary-value">
                  {vlsmResults.lanSubnets.reduce((sum, lan) => sum + lan.hostsRequired, 0).toLocaleString('fr-FR')}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Adresses IP utilisées :</span>
                <span className="summary-value">
                  {vlsmResults.lanSubnets.reduce((sum, lan) => sum + lan.usableHosts + 2, 0) + 
                   vlsmResults.wanSubnets.length * 4}
                </span>
              </div>
            </div>
          </div>

          <div className="print-instructions">
            <h3>Instructions d'impression</h3>
            <p>Ces tableaux sont maintenant remplis avec tous les calculs VLSM. Utilisez Ctrl+P pour imprimer cette page.</p>
            <p>Les sous-réseaux sont automatiquement triés par ordre décroissant du nombre d'hôtes requis selon la méthode VLSM.</p>
            <p>Chaque sous-réseau utilise exactement la taille de bloc nécessaire pour optimiser l'utilisation des adresses IP.</p>
          </div>
        </div>
      )}

      <footer className="footer">
        <p>Créé par Babtich El Habib © 2025</p>
      </footer>
    </div>
  );
}

export default VLSMCalculator;