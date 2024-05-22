import React, { useEffect, useState } from 'react';
import supabase from './supabaseClient';

const Commercial = () => {
    const [commercials, setCommercials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newCommercial, setNewCommercial] = useState({ id: '', userName: '', password: '' });
    const [editingCommercial, setEditingCommercial] = useState(null);

    useEffect(() => {
        fetchCommercials();
    }, []);

    const fetchCommercials = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('commercial').select();
        if (error) {
            console.error('Error fetching commercials:', error);
        } else {
            setCommercials(data);
        }
        setLoading(false);
    };

    const handleAddCommercial = async () => {
        try {
            newCommercial.id = commercials.length + 1;
            console.log('Adding commercial:', newCommercial);
            const { data, error } = await supabase.from('commercial').insert([newCommercial]);
            if (error) {
                console.error('Error adding commercial:', error);
            } else {
                console.log('Added commercial:', data);
                setCommercials([...commercials, ...data]);
                setNewCommercial({ id: '', userName: '', password: '' });
            }
        } catch (error) {
            console.error('Unexpected error:', error);
        }
    };

    const handleUpdateCommercial = async (commercial) => {
        const { data, error } = await supabase
            .from('commercial')
            .update({ userName: commercial.userName, password: commercial.password })
            .eq('id', commercial.id);
        if (error) {
            console.error('Error updating commercial:', error);
        } else {
            setCommercials(commercials.map((c) => (c.id === commercial.id ? data[0] : c)));
            setEditingCommercial(null);
        }
    };

    const handleDeleteCommercial = async (id) => {
        const { error } = await supabase.from('commercial').delete().eq('id', id);
        if (error) {
            console.error('Error deleting commercial:', error);
        } else {
            setCommercials(commercials.filter((c) => c.id !== id));
        }
    };

    return (
        <div className="commercial-container">
            <h2>Gestion des Commerciaux</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Password</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {commercials.map((commercial) => (
                            <tr key={commercial.id}>
                                <td>
                                    {editingCommercial?.id === commercial.id ? (
                                        <input
                                            type="text"
                                            value={editingCommercial.userName}
                                            onChange={(e) =>
                                                setEditingCommercial({ ...editingCommercial, userName: e.target.value })
                                            }
                                        />
                                    ) : (
                                        commercial.userName
                                    )}
                                </td>
                                <td>
                                    {editingCommercial?.id === commercial.id ? (
                                        <input
                                            type="text"
                                            value={editingCommercial.password}
                                            onChange={(e) =>
                                                setEditingCommercial({ ...editingCommercial, password: e.target.value })
                                            }
                                        />
                                    ) : (
                                        commercial.password
                                    )}
                                </td>
                                <td>
                                    {editingCommercial?.id === commercial.id ? (
                                        <button onClick={() => handleUpdateCommercial(editingCommercial)}>
                                            Save
                                        </button>
                                    ) : (
                                        <button onClick={() => setEditingCommercial(commercial)}>Edit</button>
                                    )}
                                    <button onClick={() => handleDeleteCommercial(commercial.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <div className="add-commercial">
                <h3>Add Commercial</h3>
                <input
                    type="text"
                    placeholder="Name"
                    value={newCommercial.userName}
                    onChange={(e) => setNewCommercial({ ...newCommercial, userName: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Password"
                    value={newCommercial.password}
                    onChange={(e) => setNewCommercial({ ...newCommercial, password: e.target.value })}
                />
                <button onClick={handleAddCommercial}>Add</button>
            </div>
        </div>
    );
};

export default Commercial;
