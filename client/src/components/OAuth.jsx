import { Button } from 'flowbite-react';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function OAuth() {
    const auth = getAuth(app);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });

        setLoading(true);
        setError(null);

        try {
            const resultsFromGoogle = await signInWithPopup(auth, provider);

            if (!resultsFromGoogle.user) {
                throw new Error('Google sign-in failed. No user data received.');
            }

            const API_URL = process.env.REACT_APP_API_URL || '';
            const res = await fetch(`${API_URL}/api/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: resultsFromGoogle.user.displayName,
                    email: resultsFromGoogle.user.email,
                    googlePhotoUrl: resultsFromGoogle.user.photoURL,
                }),
            });

            let data;
            try {
                data = await res.json();
            } catch (jsonError) {
                throw new Error('Server error. Please try again later.');
            }

            if (res.ok) {
                dispatch(signInSuccess(data));
                navigate('/');
            } else {
                setError(data.message || 'Something went wrong with Google sign-in');
            }
        } catch (error) {
            console.error(error);
            setError(error.message || 'Failed to sign in with Google. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button
                type='button'
                gradientDuoTone='pinkToOrange'
                outline
                onClick={handleGoogleClick}
                disabled={loading}
                aria-label="Sign in with Google"
            >
                {loading ? (
                    <>
                        <svg className="w-5 h-5 mr-2 animate-spin" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        Signing in...
                    </>
                ) : (
                    <>
                        <AiFillGoogleCircle className='w-6 h-6 mr-2' />
                        Continue with Google
                    </>
                )}
            </Button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </>
    );
}
