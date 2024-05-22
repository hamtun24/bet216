import React, { useEffect, useState } from 'react';
import supabase from './supabaseClient';

const Admin = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newAdmin, setNewAdmin] = useState({ id: '', username: '', password: '' });
    const [editingAdmin, setEditingAdmin] = useState(null);

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('admin').select();
        if (error) {
            console.error('Error fetching admins:', error);
        } else {
            setAdmins(data);
        }
        setLoading(false);
    };

    const handleAddAdmin = async () => {
        try {
            newAdmin.id = admins.length + 1;
            console.log('Adding admin:', newAdmin);
            const { data, error } = await supabase.from('admin').insert([newAdmin]);
            if (error) {
                console.error('Error adding admin:', error);
            } else {
                console.log('Added admin:', data);
                setAdmins([...admins, ...data]);
                setNewAdmin({ id: '', username: '', password: '' });
            }
        } catch (error) {
            console.error('Unexpected error:', error);
        }
    };

    const handleUpdateAdmin = async (admin) => {
        const { data, error } = await supabase
            .from('admin')
            .update({ username: admin.username, password: admin.password })
            .eq('id', admin.id);
        if (error) {
            console.error('Error updating admin:', error);
        } else {
            setAdmins(admins.map((a) => (a.id === admin.id ? data[0] : a)));
            setEditingAdmin(null);
        }
    };

    const handleDeleteAdmin = async (id) => {
        const { error } = await supabase.from('admin').delete().eq('id', id);
        if (error) {
            console.error('Error deleting admin:', error);
        } else {
            setAdmins(admins.filter((a) => a.id !== id));
        }
    };

    return (
        <div className="admin-container">
            <h2>Gestion des Administrateurs</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Password</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admins.map((admin) => (
                            <tr key={admin.id}>
                                <td>
                                    {editingAdmin?.id === admin.id ? (
                                        <input
                                            type="text"
                                            value={editingAdmin.username}
                                            onChange={(e) =>
                                                setEditingAdmin({ ...editingAdmin, username: e.target.value })
                                            }
                                        />
                                    ) : (
                                        admin.username
                                    )}
                                </td>
                                <td>
                                    {editingAdmin?.id === admin.id ? (
                                        <input
                                            type="text"
                                            value={editingAdmin.password}
                                            onChange={(e) =>
                                                setEditingAdmin({ ...editingAdmin, password: e.target.value })
                                            }
                                        />
                                    ) : (
                                        admin.password
                                    )}
                                </td>
                                <td>
                                    {editingAdmin?.id === admin.id ? (
                                        <button onClick={() => handleUpdateAdmin(editingAdmin)}>Save</button>
                                    ) : (
                                        <button onClick={() => setEditingAdmin(admin)}>Edit</button>
                                    )}
                                    <button onClick={() => handleDeleteAdmin(admin.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <div className="add-admin">
                <h3>Add Admin</h3>
                <input
                    type="text"
                    placeholder="Username"
                    value={newAdmin.username}
                    onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Password"
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                />
                <button onClick={handleAddAdmin}>Add</button>
            </div>
        </div>
    );
};

export default Admin;
