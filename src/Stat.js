// Stat.js

import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css'; // Assuming you have a CSS file for styling
import CommercialStats from './CommercialStats';
import supabase from './supabaseClient'; // Assuming you have a Supabase utility file

const Stat = () => {
  const [bonDeLivraisons, setBonDeLivraisons] = useState([]);
  const [totals, setTotals] = useState({ lot: 0, nbCartes: 0, mtTotal: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    fetchBonDeLivraisons();
  }, []);

  const fetchBonDeLivraisons = async () => {
    try {
      const { data, error } = await supabase.from('tablebl').select('*');
      if (error) throw error;

      // Fetch client and commercial names
      const bonDeLivraisonsWithNames = await Promise.all(data.map(async (bl) => {
        const clientNameRes = await supabase.from('client').select('name').eq('id', bl.client).single();
        const commercialNameRes = await supabase.from('commercial').select('userName').eq('id', bl.commercial).single();
        
        return {
          ...bl,
          clientName: clientNameRes.data ? clientNameRes.data.name : 'Unknown',
          commercialName: commercialNameRes.data ? commercialNameRes.data.userName : 'Unknown'
        };
      }));

      setBonDeLivraisons(bonDeLivraisonsWithNames);
      calculateTotals(bonDeLivraisonsWithNames);
    } catch (error) {
      console.error('Error fetching Bon De Livraisons:', error.message);
    }
  };

  const calculateTotals = (bonDeLivraisons) => {
    const totals = bonDeLivraisons.reduce((acc, bl) => {
        if(bl.lot!==null){
      acc.lot += Object.keys(bl.lot).length; 
      console.log(acc.lot)// Assuming 'lot' is an array and we sum its length
        }
      acc.nbCartes += bl.nbCartes || 0;
      acc.mtTotal += bl.mtTotal || 0;
      return acc;
    }, { lot: 0, nbCartes: 0, mtTotal: 0 });

    setTotals(totals);
  };

  const handleEditBonDeLivraison = (id) => {
    navigate(`/edit-bl/${id}`);
  };

  const handleDeleteBonDeLivraison = async (id) => {
    try {
      const { error } = await supabase.from('tablebl').delete().eq('id', id);
      if (error) throw error;
      fetchBonDeLivraisons();
    } catch (error) {
      console.error('Error deleting Bon De Livraison:', error.message);
    }
  };

  return (
    <div className="container">
      <div className="table-container">
        <table className="bl-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Client</th>
              <th>Commercial</th>
              <th>Date</th>
              <th>Lot</th>
              <th>Ancien Solde</th>
              <th>Montant Reçu</th>
              <th>Nouveau Solde</th>
              <th>Nb Cartes</th>
              <th>Mt Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bonDeLivraisons.map((bl) => (
              <tr key={bl.id}>
                <td>{bl.id}</td>
                <td>{bl.clientName}</td>
                <td>{bl.commercialName}</td>
                <td>{bl.date?.toString()}</td>
                <td>{Array.isArray(bl.lot) ? bl.lot.join(', ') : JSON.stringify(bl.lot)}</td>
                <td>{bl.ancienSolde?.toString()}</td>
                <td>{bl.montantRecu?.toString()}</td>
                <td>{bl.nouveauSolde?.toString()}</td>
                <td>{bl.nbCartes?.toString()}</td>
                <td>{bl.mtTotal?.toString()}</td>
                <td>
                  <button onClick={() => handleEditBonDeLivraison(bl.id)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button onClick={() => handleDeleteBonDeLivraison(bl.id)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
            <div className='sss'>
      <div className="totals-container">
        <h2>**************Totals Lot Vendues***************</h2>
        <p>Nb Lot: {totals.lot}</p>
        <p>Nb Cartes: {totals.nbCartes}</p>
        <p>Montant Total: {totals.mtTotal}</p>
      </div>
     
      </div>
      <div className='comstat'>
        <CommercialStats/>
      </div>
    </div>
   
  );
};

export default Stat;
