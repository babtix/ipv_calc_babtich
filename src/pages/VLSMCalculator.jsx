import { useState } from 'react';
import './Calculator.css';
import './VLSM.css';

function VLSMCalculator() {
  const [showTables, setShowTables] = useState(false);

  const generateTables = () => {
    setShowTables(true);
  };

  return (
    <div className="calculator-page">
      <div className="calculator-header">
        <h1>Calculateur VLSM</h1>
        <p>Génération de tableaux de planification VLSM pour topologies Cisco</p>
      </div>

      <div className="input-section">
        <div className="vlsm-description">
          <h3>Topologie Cisco - Laboratoire VLSM</h3>
          <p><strong>Routeurs :</strong> BR0, BR1, BR2</p>
          
          <h4>Exigences LAN (hôtes utilisables) :</h4>
          <ul>
            <li>BR0 G0/0: 16 000 hôtes</li>
            <li>BR0 G0/1: 8 000 hôtes</li>
            <li>BR1 G0/0: 2 000 hôtes</li>
            <li>BR1 G0/1: 4 000 hôtes</li>
            <li>BR2 G0/0: 500 hôtes</li>
            <li>BR2 G0/1: 1 000 hôtes</li>
          </ul>

          <h4>Liens WAN série (2 hôtes utilisables chacun) :</h4>
          <ul>
            <li>BR1 S0/0/0 – BR0 S0/0/0</li>
            <li>BR1 S0/0/1 – BR2 S0/0/1</li>
            <li>BR0 S0/0/1 – BR2 S0/0/0</li>
          </ul>
        </div>

        <button onClick={generateTables} className="calculate-btn">
          Générer les tableaux VLSM vides
        </button>
      </div>

      {showTables && (
        <div className="vlsm-tables">
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
                  <tr>
                    <td>BR0 G0/0</td>
                    <td>16 000</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>BR0 G0/1</td>
                    <td>8 000</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>BR1 G0/1</td>
                    <td>4 000</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>BR1 G0/0</td>
                    <td>2 000</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>BR2 G0/1</td>
                    <td>1 000</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>BR2 G0/0</td>
                    <td>500</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Liens WAN</td>
                    <td>2</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
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
                  <tr>
                    <td>BR0 G0/0</td>
                    <td>16 000</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>BR0 G0/1</td>
                    <td>8 000</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>BR1 G0/1</td>
                    <td>4 000</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>BR1 G0/0</td>
                    <td>2 000</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>BR2 G0/1</td>
                    <td>1 000</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>BR2 G0/0</td>
                    <td>500</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
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
                  <tr>
                    <td>BR1 S0/0/0 – BR0 S0/0/0</td>
                    <td>2</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>BR1 S0/0/1 – BR2 S0/0/1</td>
                    <td>2</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>BR0 S0/0/1 – BR2 S0/0/0</td>
                    <td>2</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="print-instructions">
            <h3>Instructions d'impression</h3>
            <p>Ces tableaux sont conçus pour être imprimés et remplis à la main. Utilisez Ctrl+P pour imprimer cette page.</p>
            <p>Les sous-réseaux sont triés par ordre décroissant du nombre d'hôtes requis pour faciliter la planification VLSM.</p>
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