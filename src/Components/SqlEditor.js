import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import axios from "axios";

const SqlEditor = () => {
    const [query, setQuery] = useState("");
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [showConfig, setShowConfig] = useState(false);
    const [isConnected, setIsConnected] = useState(false); // Track connection status

    const [dbConfig, setDbConfig] = useState({
        db_type: "postgres", // "mysql" or "postgres"
        host: "localhost",
        port: "5432",
        database: "",
        user: "",
        password: "",
    });

    // Connect to Database
    const connectDatabase = async () => {
        setError(null);
        try {
            const response = await axios.post(" ", dbConfig);
            if (response.data.success) {
                setIsConnected(true);
            } else {
                setError("Failed to connect to the database.");
            }
        } catch (err) {
            setError("Error connecting to the database.");
        }
    };

    // Disconnect from Database
    const disconnectDatabase = async () => {
        setError(null);
        try {
            const response = await axios.post("http://localhost:8000/api/disconnect-db/");
            if (response.data.success) {
                setIsConnected(false);
                setResult(null); // Clear result on disconnect
            } else {
                setError("Failed to disconnect.");
            }
        } catch (err) {
            setError("Error disconnecting from the database.");
        }
    };

    // Execute SQL Query
    const executeQuery = async () => {
        if (!isConnected) {
            setError("Please connect to the database first.");
            return;
        }

        setResult(null);
        setError(null);
        try {
            const response = await axios.post("http://localhost:8000/api/sql-execute/", {
                query
            });
            setResult(response.data);
        } catch (err) {
            setError("Error executing query.");
        }
    };

    return (
        <div>
            <h2>SQL Editor</h2>

            {/* Button to show/hide database configuration */}
            <button onClick={() => setShowConfig(!showConfig)}>
                {showConfig ? "Hide Configuration" : "Configure Database"}
            </button>

            {/* Database Configuration Fields */}
            {showConfig && (
                <div style={{ marginTop: "10px", padding: "10px", border: "1px solid #ccc" }}>
                    <label>DB Type:</label>
                    <select value={dbConfig.db_type} onChange={(e) => setDbConfig({ ...dbConfig, db_type: e.target.value })}>
                        <option value="postgres">PostgreSQL</option>
                        <option value="mysql">MySQL</option>
                    </select>
                    <input type="text" placeholder="Host" value={dbConfig.host} onChange={(e) => setDbConfig({ ...dbConfig, host: e.target.value })} />
                    <input type="text" placeholder="Port" value={dbConfig.port} onChange={(e) => setDbConfig({ ...dbConfig, port: e.target.value })} />
                    <input type="text" placeholder="Database" value={dbConfig.database} onChange={(e) => setDbConfig({ ...dbConfig, database: e.target.value })} />
                    <input type="text" placeholder="User" value={dbConfig.user} onChange={(e) => setDbConfig({ ...dbConfig, user: e.target.value })} />
                    <input type="password" placeholder="Password" value={dbConfig.password} onChange={(e) => setDbConfig({ ...dbConfig, password: e.target.value })} />
                </div>
            )}

            {/* Connect & Disconnect Buttons */}
            <div style={{ margin: "10px 0" }}>
                <button onClick={connectDatabase} disabled={isConnected}>
                    {isConnected ? "Connected" : "Connect"}
                </button>
                <button onClick={disconnectDatabase} disabled={!isConnected}>
                    Disconnect
                </button>
            </div>

            {/* Connection Status */}
            {isConnected ? <p style={{ color: "green" }}>Connected to Database</p> : <p style={{ color: "red" }}>Not Connected</p>}

            {/* SQL Editor */}
            <CodeMirror 
                value={query}
                extensions={[sql()]}
                onChange={(value) => setQuery(value)}
                height="200px"
            />
            <button onClick={executeQuery} disabled={!isConnected}>Run Query</button>

            {/* Display Result or Error */}
            {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default SqlEditor;
