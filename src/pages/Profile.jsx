import Sidebar from "../components/layouts/Sidebar";
import { useEffect, useState } from "react";
import api from "../instance/TokenInstance";

const Profile = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [id, setId] = useState('674a74dbb6da8b6e035e9653');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const response = await api.get(`/admin/get-admin/${id}`);
                setPhoneNumber(response.data.phoneNumber);
            } catch (error) {
                console.error("Error fetching admin:", error);
                setError("Error fetching admin data");
            }
        };
        fetchAdmin();
    }, [id]);

    const handleUpdate = async () => {
        try {
            const response = await api.put(`/admin/update-admin/${id}`, {
                phoneNumber: phoneNumber,
            });
            alert("Profile Updated Successfully")
        } catch (error) {
            console.error("Error updating profile:", error);
            setError("Error updating profile");
        }
    };

    return (
        <>
            <div>
                <div className="flex mt-20">
                    <Sidebar />
                    <div className="flex-grow p-7">
                        <h1 className="text-2xl font-semibold mb-4">Profile</h1>
                        <div className="max-w-md mx-auto p-5 rounded-lg">
                            <div className="mb-4">
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                    placeholder="Enter your phone number"
                                />
                            </div>

                            <button
                                onClick={handleUpdate}
                                className="w-full bg-secondary text-white p-2 rounded-md hover:bg-secondary"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;
