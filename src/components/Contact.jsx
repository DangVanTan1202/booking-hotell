import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { db } from '../firebase';

export default function Contact({ userRef, listing }) {
    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function getLandlord() {
            const docRef = doc(db, "users", userRef);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setLandlord(docSnap.data());
            } else {
                toast.error("Could not get landlord data");
            }
        }
        getLandlord();
    }, [userRef]);

    function onChange(e) {
        setMessage(e.target.value);
    }

    return (
        <>
            {landlord !== null && (
                <div className='d-flex flex-column w-100'>
                    <p>Contact {landlord.name} for the {listing.name.toLowerCase()}</p>
                    <div className='mt-3 mb-6'>
                        <textarea 
                            className='form-control' 
                            name='massage' 
                            id='message' 
                            rows='2' 
                            value={message} 
                            onChange={onChange}
                        />
                    </div>
                    <a href={`mailto:${landlord.email}?Subject=${listing.name}&body=${message}`}>
                        <button 
                            className='btn btn-primary w-100 text-center mb-3' 
                            type='button'
                        >
                            Send Message
                        </button>
                    </a>
                </div>
            )}
        </>
    );
}
