import React, { useEffect, useState } from 'react';
import './App.css'; // Import the CSS file
import supabase from './supabaseClient'; // Assuming you have a separate file for Supabase configuration

const Voucher = () => {
  const [vouchers, setVouchers] = useState([]);
  const [startLot, setStartLot] = useState('');
  const [endLot, setEndLot] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const { data, error } = await supabase.from('card').select('*');
      if (error) throw error;
      setVouchers(data || []);
    } catch (error) {
      console.error('Error fetching vouchers:', error.message);
    }
  };

  const clearSelectedRanges = async () => {
    try {
      if (!startLot || !endLot) {
        setErrorMessage('Please provide both start and end lot values.');
        return;
      }

      const start = parseInt(startLot);
      const end = parseInt(endLot);

      if (start > end) {
        setErrorMessage('Start lot should be less than or equal to end lot.');
        return;
      }

      if (window.confirm('Are you sure you want to clear selected ranges?')) {
        for (let i = start; i <= end; i++) {
          const { error } = await supabase.from('card').delete().eq('lot', i);
          if (error) throw error;
          console.log('Deleted lot:', i);
        }

        setErrorMessage('');
        console.log('Selected ranges cleared.');
        fetchVouchers();
      }
    } catch (error) {
      console.error('Error clearing selected ranges:', error.message);
    }
  };

  const importDataFromXls = async (file) => {
    try {
      if (!file) {
        setErrorMessage('Please select a file.');
        return;
      }

      const data = await readXlsFile(file);
      if (!data || data.length === 0) {
        setErrorMessage('No data found in the selected file.');
        return;
      }

      const { data: insertedData, error } = await supabase.from('card').insert(data);
      if (error) throw error;
      console.log('Import successful:', insertedData);
      fetchVouchers();
    } catch (error) {
      console.error('Error importing data from XLS:', error.message);
    }
  };

  const readXlsFile = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = event.target.result;
        const parsedData = data.split('\n').map(line => line.split(','));
        resolve(parsedData);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsText(file);
    });
  };

  return (
    <div className="voucher-container">
      <h1 className="voucher-heading">Gestion des Vouchers</h1>
      <table className="voucher-table">
        <thead>
          <tr>
            <th>Serial</th>
            <th>Lot</th>
          </tr>
        </thead>
        <tbody>
          {vouchers.map((voucher) => (
            <tr key={voucher.id}>
              <td>{voucher.serial}</td>
              <td>{voucher.lot}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="voucher-form">
        <label>Import Vouchers:</label><input type="file" onChange={(e) => importDataFromXls(e.target.files[0])} />
        <div>
          <label>Start Lot:</label>
          <input type="text" value={startLot} onChange={(e) => setStartLot(e.target.value)} />
        </div>
        <div>
          <label>End Lot:</label>
          <input type="text" value={endLot} onChange={(e) => setEndLot(e.target.value)} />
        </div>
        <button onClick={clearSelectedRanges}>Clear Selected</button>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>
    </div>
  );
};

export default Voucher;
