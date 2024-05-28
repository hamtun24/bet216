import { faEdit, faPrint, faRedo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import './App.css';
import supabase from './supabaseClient'; // Assuming you have a Supabase utility file

const CommercialStats = () => {
  const [commercials, setCommercials] = useState([]);
  const [selectedCommercial, setSelectedCommercial] = useState('');
  const [commercialStats, setCommercialStats] = useState({ lot: 0, nbCartes: 0, mtTotal: 0, solde: 0 });
  const [newSolde, setNewSolde] = useState('');

  const printRef = useRef();

  useEffect(() => {
    fetchCommercials();
  }, []);

  const fetchCommercials = async () => {
    try {
      const { data, error } = await supabase.from('commercial').select('*');
      if (error) throw error;
      setCommercials(data);
    } catch (error) {
      console.error('Error fetching commercials:', error.message);
    }
  };

  const handleCommercialChange = (e) => {
    const commercialId = e.target.value;
    setSelectedCommercial(commercialId);
    fetchCommercialStats(commercialId);
  };

  const fetchCommercialStats = async (commercialId) => {
    try {
      const { data, error } = await supabase
        .from('tablebl')
        .select('*')
        .eq('commercial', commercialId);

      if (error) throw error;

      const { data: soldeData, error: soldeError } = await supabase
        .from('commercial')
        .select('solde')
        .eq('id', commercialId)
        .single();

      if (soldeError) throw soldeError;

      const stats = data.reduce(
        (acc, bl) => {
          if (bl.lot !== null) {
            acc.lot += Object.keys(bl.lot).length;
          }
          acc.nbCartes += bl.nbCartes || 0;
          acc.mtTotal += bl.mtTotal || 0;
          return acc;
        },
        { lot: 0, nbCartes: 0, mtTotal: 0, solde: soldeData.solde }
      );

      setCommercialStats(stats);
    } catch (error) {
      console.error('Error fetching commercial stats:', error.message);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: 'Commercial Stats',
    onBeforeGetContent: () => {
      console.log('Printing...');
    },
    onAfterPrint: () => {
      console.log('Printed successfully!');
    },
    onError: (error) => {
      console.error('Error during printing:', error);
    },
  });

  const handleReset = async () => {
    try {
      const { error } = await supabase
        .from('commercial')
        .update({ solde: 0 })
        .eq('id', selectedCommercial);
      if (error) throw error;
      alert('Solde reset to 0');
      fetchCommercials(); // Refresh the commercials data
      fetchCommercialStats(selectedCommercial); // Refresh the stats for the selected commercial
    } catch (error) {
      console.error('Error resetting solde:', error.message);
    }
  };

  const handleChangeSolde = async () => {
    if (newSolde === '') {
      alert('Please enter a value for the new solde');
      return;
    }
    try {
      const { error } = await supabase
        .from('commercial')
        .update({ solde: parseFloat(newSolde) })
        .eq('id', selectedCommercial);
      if (error) throw error;
      alert(`Solde changed to ${newSolde}`);
      setNewSolde(''); // Clear the input field
      fetchCommercialStats(selectedCommercial); // Refresh the stats for the selected commercial
    } catch (error) {
      console.error('Error changing solde:', error.message);
    }
  };

  return (
    <div className='CommStat'>
      <h2 className='cos'>*****************Commercial Stats*****************</h2>
      <label htmlFor="commercialSelect">Select Commercial: </label>
      <select id="commercialSelect" value={selectedCommercial} onChange={handleCommercialChange}>
        <option value="">Select a commercial</option>
        {commercials.map((commercial) => (
          <option key={commercial.id} value={commercial.id}>
            {commercial.userName}
          </option>
        ))}
      </select>
      {selectedCommercial && (
        <div>
          <div>
            <p><strong>Total Lots Vendues: </strong>{commercialStats.lot}</p>
            <p><strong>Nb Total de Cartes:</strong> {commercialStats.nbCartes}</p>
            <p><strong>Montant Total Des Cartes: </strong>{commercialStats.mtTotal} DT</p>
            <p><strong>Solde:</strong> {commercialStats.solde}</p>
          </div>
          <div>
            <input
              type="number"
              value={newSolde}
              onChange={(e) => setNewSolde(e.target.value)}
              placeholder="New Solde"
            />
            <button onClick={handleChangeSolde}>
              <FontAwesomeIcon icon={faEdit} /> Change
            </button>
          </div>
          <button onClick={handlePrint}>
            <FontAwesomeIcon icon={faPrint} /> Print
          </button>
          <button onClick={handleReset}>
            <FontAwesomeIcon icon={faRedo} /> Reset
          </button>
        </div>
      )}
      <div style={{ display: 'none' }}>
        <PrintableStats ref={printRef} stats={commercialStats} />
      </div>
    </div>
  );
};

const PrintableStats = React.forwardRef((props, ref) => {
  const { lot, nbCartes, mtTotal, solde } = props.stats;
  return (
    <div ref={ref} className='print-content'>
      <h2 className='tt'>Reglement Commercial</h2>
      <p><strong>Total Lots Vendues:</strong> {lot}</p>
      <p><strong>Nb Total de Cartes:</strong> {nbCartes}</p>
      <p><strong>Montant Total Des Cartes:</strong> {mtTotal} DT</p>
      <p><strong>Solde:</strong> {solde}</p>
      <p><strong>Signature</strong></p>
      <p>Commercial &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Cassier</p>
    </div>
  );
});


export default CommercialStats;
