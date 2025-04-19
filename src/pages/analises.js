// ... existing imports ...

const columns = [
  // ... other columns ...
  {
    title: 'Volume Social',
    dataIndex: 'volume_social',
    key: 'volume_social',
    render: (text) => (
      <span style={{
        color: text === 'Alto' ? '#4CAF50' :  // green for Alto
              text === 'Muito Alto' ? '#4CAF50' :  // green for Muito Alto
              text === 'Médio' ? '#FFC107' :  // yellow
              text === 'Baixo' || text === 'Muito Baixo' ? '#F44336' :  // red
              'inherit',
        fontWeight: 'bold'
      }}>
        {text}
      </span>
    ),
  },
  // ... other columns ...
];

// ... rest of the component code ...