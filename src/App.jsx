import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [username, setUsername] = useState('Dhyey-Ghoniya');
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchRepositories = async (targetUser) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://api.github.com/users/${targetUser}/repos?sort=updated&per_page=20`);
      if (!res.ok) {
        throw new Error(`Failed to fetch repositories for '${targetUser}' (Status ${res.status})`);
      }
      const data = await res.json();
      setRepos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepositories(username);
  }, [username]);

  const filteredRepos = repos.filter(repo =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="app-layout">
      <nav className="navbar">
        <div className="container nav-container">
          <div className="brand-link">24CS024 | REST API Integration</div>
          <div className="nav-meta">ITUE301 - AWDF Practical 3</div>
        </div>
      </nav>

      <main className="container main-content">
        <div className="page-card">
          <div className="page-header">
            <span className="page-badge">useEffect & Asynchronous Data Fetching</span>
            <h1 className="page-title">GitHub Repository Explorer</h1>
            <p className="page-subtitle">
              Consuming the GitHub REST API in React with full lifecycle states (Loading, Error, Data Rendering).
            </p>
          </div>

          <div className="controls-bar">
            <input
              type="text"
              className="search-input"
              placeholder="Search fetched repositories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="button"
              className="btn-primary"
              onClick={() => fetchRepositories(username)}
            >
              🔄 Refresh Repos
            </button>
            <button
              type="button"
              className="btn-primary"
              style={{ background: '#334155' }}
              onClick={() => {
                const nextUser = username === 'Dhyey-Ghoniya' ? 'facebook' : 'Dhyey-Ghoniya';
                setUsername(nextUser);
              }}
            >
              Switch User ({username})
            </button>
          </div>

          {loading && (
            <div className="loading-box">
              <div className="spinner"></div>
              <p className="loading-text">Fetching live repositories for <strong>{username}</strong>...</p>
            </div>
          )}

          {error && !loading && (
            <div className="error-banner">
              <div>
                <strong>Error Occurred:</strong> {error}
              </div>
              <button
                type="button"
                className="btn-primary"
                style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                onClick={() => fetchRepositories(username)}
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', color: '#94a3b8' }}>
                <span>Found <strong>{filteredRepos.length}</strong> repositories for <code>{username}</code></span>
                <span>Source: api.github.com/users/{username}/repos</span>
              </div>

              {filteredRepos.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#64748b', padding: '3rem 0' }}>
                  No repositories match the filter criteria.
                </p>
              ) : (
                <div className="repos-grid">
                  {filteredRepos.map(repo => (
                    <div key={repo.id} className="repo-card">
                      <div>
                        <div className="repo-header">
                          <a href={repo.html_url} target="_blank" rel="noreferrer" className="repo-name">
                            {repo.name}
                          </a>
                        </div>
                        <p className="repo-desc">
                          {repo.description || 'No description provided for this repository.'}
                        </p>
                      </div>
                      <div className="repo-footer">
                        <span className="lang-badge">{repo.language || 'Code'}</span>
                        <span>⭐ {repo.stargazers_count} &nbsp; 🍴 {repo.forks_count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          © {new Date().getFullYear()} Ghoniya Dhyey (24CS024) - CHARUSAT CSPIT. Practical 3 API Integration.
        </div>
      </footer>
    </div>
  );
}

export default App;