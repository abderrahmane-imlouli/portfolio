/**
 * Interactive Network Lab Topology Visualizer
 * Documents Sonatrach Irara Base Supervised Security Lab:
 * 1 Router -> 1 Firewall -> 2 Core Switches -> 12 Distribution Switches -> Endpoints
 */

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('topology-diagram-mount');
  const detailsBox = document.getElementById('topology-details');

  if (!container) return;

  const topologyLayers = {
    router: {
      name: "Edge Routing Layer",
      hardware: "1x Enterprise Gateway Router",
      config: ["BGP Edge Peering", "OSPF Area 0 Dynamic Routing", "HSRP Gateway Redundancy", "Secure Device Hardening (SSH, AAA)"]
    },
    firewall: {
      name: "Security Inspection Layer",
      hardware: "1x Enterprise Next-Gen Firewall (FortiGate)",
      config: ["DMZ & WAF Policy Enforcement", "Deep Packet Inspection", "VPN Access Gateway", "Centralized Log Export (Elastic/Kibana)"]
    },
    core: {
      name: "Core Switching Backbone",
      hardware: "2x Layer-3 Core Switches (Redundant Pair)",
      config: ["High-speed Inter-VLAN Routing", "HSRP Active/Standby Virtual Gateways", "802.1Q Trunks & EtherChannel Link Aggregation", "OSPF Multi-Area Routing"]
    },
    dist: {
      name: "Distribution & Security Aggregation",
      hardware: "12x Distribution Switches across Units",
      config: ["VLAN Segmentation (Finance, MOG, Logistics, Guests)", "Spanning Tree Protocol (STP) + PortFast / BPDU Guard", "DHCP Snooping + Binding Database", "Dynamic ARP Inspection (DAI)", "IP Source Guard (IPSG)"]
    },
    access_sw: {
      name: "Access Switching Layer",
      hardware: "Dedicated Access Layer Switches",
      config: ["802.1X Port-Based Authentication", "Port Security (Sticky MAC Aging & Limit)", "BPDU Guard & Storm Control", "Unused Port Shutdown & Blackhole VLAN Isolation"]
    },
    access: {
      name: "Endpoints & Industrial SCADA/OT",
      hardware: "Enterprise Workstations & Industrial RTUs",
      config: ["Symantec Endpoint Protection / EDR Agent", "Nozomi Networks OT Passive Anomaly Detection", "Secure Industrial Fieldbus & DNP3 Telemetry", "VLAN 10/20/30/WiFi Isolated Gateways"]
    }
  };

  function updateDetails(layerKey) {
    if (!detailsBox || !topologyLayers[layerKey]) return;
    const data = topologyLayers[layerKey];
    
    detailsBox.innerHTML = `
      <div style="background: var(--bg-elevated); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 16px; margin-top: 16px; animation: fadeIn 0.2s ease;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <h4 style="color: var(--accent-primary); font-family: var(--font-mono); font-size: 1rem;">${data.name}</h4>
          <span class="badge badge-verified">${data.hardware}</span>
        </div>
        <ul style="list-style: none; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 8px;">
          ${data.config.map(item => `<li style="font-size: 0.85rem; color: var(--text-secondary);"><span style="color: var(--accent-primary); margin-right: 6px;">▸</span>${item}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  // Render SVG interactive diagram with full 5-tier explicit hierarchy
  container.innerHTML = `
    <svg viewBox="0 0 800 420" width="100%" height="auto" style="max-height: 440px; font-family: var(--font-mono); overflow: visible;">
      <defs>
        <linearGradient id="grad-accent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#35D0A0" stop-opacity="0.2"/>
          <stop offset="100%" stop-color="#1FA77E" stop-opacity="0.05"/>
        </linearGradient>
      </defs>

      <!-- Connecting Lines -->
      <line x1="400" y1="40" x2="400" y2="90" stroke="#252D38" stroke-width="2" stroke-dasharray="4"/>
      <line x1="400" y1="90" x2="280" y2="150" stroke="#252D38" stroke-width="2"/>
      <line x1="400" y1="90" x2="520" y2="150" stroke="#252D38" stroke-width="2"/>
      <line x1="280" y1="150" x2="520" y2="150" stroke="#35D0A0" stroke-width="1.5" stroke-opacity="0.4" stroke-dasharray="3"/>
      
      <!-- Core to Distribution Buses -->
      <line x1="280" y1="180" x2="180" y2="230" stroke="#252D38" stroke-width="2"/>
      <line x1="280" y1="180" x2="380" y2="230" stroke="#252D38" stroke-width="2"/>
      <line x1="520" y1="180" x2="420" y2="230" stroke="#252D38" stroke-width="2"/>
      <line x1="520" y1="180" x2="620" y2="230" stroke="#252D38" stroke-width="2"/>

      <!-- Distribution to Dedicated Access Switches -->
      <line x1="180" y1="260" x2="180" y2="305" stroke="#252D38" stroke-width="2"/>
      <line x1="380" y1="260" x2="380" y2="305" stroke="#252D38" stroke-width="2"/>
      <line x1="420" y1="260" x2="420" y2="305" stroke="#252D38" stroke-width="2"/>
      <line x1="620" y1="260" x2="620" y2="305" stroke="#252D38" stroke-width="2"/>

      <!-- Access Switches to Endpoints -->
      <line x1="180" y1="340" x2="180" y2="375" stroke="#252D38" stroke-width="1.5"/>
      <line x1="380" y1="340" x2="380" y2="375" stroke="#252D38" stroke-width="1.5"/>
      <line x1="420" y1="340" x2="420" y2="375" stroke="#252D38" stroke-width="1.5"/>
      <line x1="620" y1="340" x2="620" y2="375" stroke="#252D38" stroke-width="1.5"/>

      <!-- LAYER 1: Edge Router -->
      <g class="topo-node" data-layer="router" style="cursor: pointer;">
        <rect x="310" y="10" width="180" height="36" rx="8" fill="#11161D" stroke="#35D0A0" stroke-width="1.5"/>
        <text x="400" y="33" fill="#F5F7FA" font-size="11.5" font-weight="600" text-anchor="middle">EDGE ROUTER (OSPF/BGP)</text>
      </g>

      <!-- LAYER 2: FortiGate Firewall -->
      <g class="topo-node" data-layer="firewall" style="cursor: pointer;">
        <rect x="300" y="70" width="200" height="36" rx="8" fill="#151B23" stroke="#252D38" stroke-width="1.5"/>
        <text x="400" y="93" fill="#5EE7C2" font-size="11.5" font-weight="600" text-anchor="middle">NEXT-GEN FIREWALL (WAF/DMZ)</text>
      </g>

      <!-- LAYER 3: Dual Core Switches -->
      <g class="topo-node" data-layer="core" style="cursor: pointer;">
        <rect x="190" y="135" width="180" height="38" rx="8" fill="#11161D" stroke="#252D38" stroke-width="1.5"/>
        <text x="280" y="159" fill="#F5F7FA" font-size="10.5" text-anchor="middle">CORE SWITCH A (HSRP/L3)</text>
      </g>
      <g class="topo-node" data-layer="core" style="cursor: pointer;">
        <rect x="430" y="135" width="180" height="38" rx="8" fill="#11161D" stroke="#252D38" stroke-width="1.5"/>
        <text x="520" y="159" fill="#F5F7FA" font-size="10.5" text-anchor="middle">CORE SWITCH B (HSRP/L3)</text>
      </g>

      <!-- LAYER 4: Distribution Layer (12 Switches) -->
      <g class="topo-node" data-layer="dist" style="cursor: pointer;">
        <rect x="80" y="215" width="200" height="36" rx="6" fill="#151B23" stroke="#252D38" stroke-width="1.5"/>
        <text x="180" y="238" fill="#A7B0BC" font-size="10" text-anchor="middle">DIST SWITCHES (1-6) [STP/DAI]</text>
      </g>
      <g class="topo-node" data-layer="dist" style="cursor: pointer;">
        <rect x="520" y="215" width="200" height="36" rx="6" fill="#151B23" stroke="#252D38" stroke-width="1.5"/>
        <text x="620" y="238" fill="#A7B0BC" font-size="10" text-anchor="middle">DIST SWITCHES (7-12) [Snooping]</text>
      </g>

      <!-- LAYER 5: Dedicated Access Switches (802.1X / Port Security) -->
      <g class="topo-node" data-layer="access_sw" style="cursor: pointer;">
        <rect x="80" y="295" width="200" height="34" rx="6" fill="#11161D" stroke="#35D0A0" stroke-width="1.2" stroke-dasharray="2"/>
        <text x="180" y="317" fill="#5EE7C2" font-size="9.5" text-anchor="middle">ACCESS SWITCHES [802.1X/PortSec]</text>
      </g>
      <g class="topo-node" data-layer="access_sw" style="cursor: pointer;">
        <rect x="520" y="295" width="200" height="34" rx="6" fill="#11161D" stroke="#35D0A0" stroke-width="1.2" stroke-dasharray="2"/>
        <text x="620" y="317" fill="#5EE7C2" font-size="9.5" text-anchor="middle">ACCESS SWITCHES [Port Hardening]</text>
      </g>

      <!-- LAYER 6: Endpoints & SCADA/OT Interfaces -->
      <g class="topo-node" data-layer="access" style="cursor: pointer;">
        <rect x="60" y="375" width="240" height="30" rx="4" fill="#0D1117" stroke="#252D38"/>
        <text x="180" y="394" fill="#707A87" font-size="9.5" text-anchor="middle">VLAN 10: Finance · VLAN 20: MOG</text>
      </g>
      <g class="topo-node" data-layer="access" style="cursor: pointer;">
        <rect x="500" y="375" width="240" height="30" rx="4" fill="#0D1117" stroke="#252D38"/>
        <text x="620" y="394" fill="#707A87" font-size="9.5" text-anchor="middle">VLAN 30: Log · OT SCADA (Nozomi)</text>
      </g>
    </svg>
  `;

  // Attach hover/click events
  const nodes = container.querySelectorAll('.topo-node');
  nodes.forEach(node => {
    node.addEventListener('mouseenter', () => {
      const rect = node.querySelector('rect');
      if (rect) rect.style.stroke = 'var(--accent-primary)';
      updateDetails(node.getAttribute('data-layer'));
    });

    node.addEventListener('mouseleave', () => {
      const rect = node.querySelector('rect');
      if (rect) rect.style.stroke = '';
    });

    node.addEventListener('click', () => {
      updateDetails(node.getAttribute('data-layer'));
    });
  });

  // Default active view
  updateDetails('dist');
});
