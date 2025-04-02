import React, { useEffect, useState } from "react";

interface TUser {
    id: string;
    name: string;
    balance: number;
    email: string;
    registerAt: Date;
    active: boolean;
}

const formatBalance = (balance: number) =>
    `$${balance.toLocaleString(undefined, { minimumFractionDigits: 3 })}`;

type SortField = 'name' | 'balance';
type SortDirection = 'asc' | 'desc';

const LoadingSpinner: React.FC = () => (
    <div className="loading-spinner">
        <div className="spinner"></div>
    </div>
);

const UsersTable: React.FC = () => {
    const [users, setUsers] = useState<TUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState<SortField>('name');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });
    const usersPerPage = 10;

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    useEffect(() => {
        const fakeUsers: TUser[] = Array.from({ length: 100 }, (_, i) => ({
            id: `${i + 1}`,
            name: `User ${i + 1}`,
            balance: Math.random() * 5000,
            email: `user${i + 1}@example.com`,
            registerAt: new Date(),
            active: Math.random() > 0.5,
        }));

        setTimeout(() => {
            setUsers(fakeUsers);
            setLoading(false);
        }, 1000);
    }, []);

    const handleDelete = (id: string) => {
        setUsers(users.filter(user => user.id !== id));
    };

    const toggleStatus = (id: string) => {
        setUsers(users.map(user =>
            user.id === id ? { ...user, active: !user.active } : user
        ));
    };

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }

        const sortedUsers = [...users].sort((a, b) => {
            if (field === 'name') {
                return sortDirection === 'asc'
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name);
            } else {
                return sortDirection === 'asc'
                    ? a.balance - b.balance
                    : b.balance - a.balance;
            }
        });
        setUsers(sortedUsers);
    };

    const toggleTheme = () => {
        setIsDarkMode(prev => !prev);
    };

    if (error) return <p>Error: {error}</p>;

    const totalPages = Math.ceil(users.length / usersPerPage);
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    const renderPagination = () => {
        let pages = [];
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);

        if (startPage > 1) pages.push(1);
        if (startPage > 2) pages.push("...");

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        if (endPage < totalPages - 1) pages.push("...");
        if (endPage < totalPages) pages.push(totalPages);

        return pages;
    };

    return (
        <div style={{ position: 'relative' }}>
            {loading && (
                <div className="loading-overlay">
                    <LoadingSpinner />
                </div>
            )}
            <table>
                <thead>
                    <tr>
                        <th>
                            Name
                            <button
                                onClick={() => handleSort('name')}
                                className={`sort-button ${sortField === 'name' ? 'active' : ''}`}
                            >
                                {sortField === 'name' ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}
                            </button>
                        </th>
                        <th>
                            Balance
                            <button
                                onClick={() => handleSort('balance')}
                                className={`sort-button ${sortField === 'balance' ? 'active' : ''}`}
                            >
                                {sortField === 'balance' ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}
                            </button>
                        </th>
                        <th>Email</th>
                        <th>Register Date</th>
                        <th>Status</th>
                        <th>Action</th>
                        <th>
                            <button className="theme-toggle" onClick={toggleTheme}>
                                {isDarkMode ? '☀️' : '🌙'}
                            </button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.map((user) => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{formatBalance(user.balance)}</td>
                            <td>
                                <a href={`mailto:${user.email}`}>{user.email}</a>
                            </td>
                            <td title={user.registerAt.toISOString()}>
                                {user.registerAt.toISOString().split("T")[0]}
                            </td>
                            <td>
                                <button onClick={() => toggleStatus(user.id)}>
                                    {user.active ? "Active" : "Inactive"}
                                </button>
                            </td>
                            <td>
                                <button>Edit</button>
                                <button onClick={() => handleDelete(user.id)}>Delete</button>
                            </td>
                            <td></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="page-container">
                <div className="length">
                    {users.length} users
                </div>
                <div className={`page-buttons`}>
                    {renderPagination().map((page, index) =>
                        page === "..." ? (
                            <span key={index}>...</span>
                        ) : (
                            <button
                                key={index}
                                onClick={() => setCurrentPage(Number(page))}
                                className={`page-button ${currentPage === page ? "active" : ""}`}>
                                {page}
                            </button>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default UsersTable;
