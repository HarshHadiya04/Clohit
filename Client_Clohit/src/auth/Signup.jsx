import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
    const navigate = useNavigate();
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Signup failed');
            localStorage.setItem('clohit_token', data.token);
            localStorage.setItem('clohit_user', JSON.stringify(data.user));
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const containerStyle = {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #eb5e28 0%, #ff8c42 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
    };

    const cardStyle = {
        backgroundColor: 'white',
        borderRadius: '15px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        padding: '40px',
        width: '100%',
        maxWidth: '450px',
        border: 'none'
    };

    const titleStyle = {
        color: '#eb5e28',
        textAlign: 'center',
        marginBottom: '30px',
        fontSize: '2.5rem',
        fontFamily: "'Lobster', sans-serif",
        fontWeight: 'bold'
    };

    const inputStyle = {
        border: '2px solid #e0e0e0',
        borderRadius: '10px',
        padding: '12px 15px',
        fontSize: '16px',
        transition: 'all 0.3s ease',
        backgroundColor: '#f8f9fa'
    };

    const buttonStyle = {
        backgroundColor: '#eb5e28',
        border: 'none',
        borderRadius: '10px',
        padding: '12px',
        fontSize: '18px',
        fontWeight: 'bold',
        color: 'white',
        transition: 'all 0.3s ease',
        width: '100%'
    };

    const linkStyle = {
        color: '#eb5e28',
        textDecoration: 'none',
        fontWeight: 'bold'
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h2 style={titleStyle}>Join Clohit</h2>
                <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
                    Create your account and start shopping
                </p>
                
                {error && (
                    <div className="alert alert-danger" style={{ borderRadius: '10px', border: 'none' }}>
                        {error}
                    </div>
                )}
                
                <form onSubmit={onSubmit}>
                    <div className="mb-4">
                        <label className="form-label" style={{ fontWeight: 'bold', color: '#333' }}>
                            Full Name
                        </label>
                        <input 
                            value={name} 
                            onChange={e => setName(e.target.value)} 
                            type="text" 
                            className="form-control" 
                            style={inputStyle}
                            placeholder="Enter your full name"
                            required 
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="form-label" style={{ fontWeight: 'bold', color: '#333' }}>
                            Email Address
                        </label>
                        <input 
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                            type="email" 
                            className="form-control" 
                            style={inputStyle}
                            placeholder="Enter your email"
                            required 
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="form-label" style={{ fontWeight: 'bold', color: '#333' }}>
                            Password
                        </label>
                        <input 
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                            type="password" 
                            className="form-control" 
                            style={inputStyle}
                            placeholder="Create a password"
                            required 
                        />
                    </div>
                    
                    <button 
                        className="btn" 
                        style={buttonStyle}
                        disabled={loading}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#d1451e'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#eb5e28'}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>
                
                <div style={{ textAlign: 'center', marginTop: '30px', color: '#666' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={linkStyle}>
                        Sign In
                    </Link>
                </div>
                
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <Link to="/" style={{ ...linkStyle, fontSize: '14px' }}>
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Signup;
