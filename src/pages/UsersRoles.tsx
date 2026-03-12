import { Header } from "../components/Header";
import { Search, ChevronDown, ListFilter, UserPlus, MoreVertical, Shield, Mail, CheckCircle } from "lucide-react";

const MOCK_USERS = [
    {
        id: "USR_001",
        name: "Jane Smith",
        email: "jane.smith@company.com",
        role: "Admin",
        status: "Active",
        lastActive: "2024-02-15 14:32",
        documentsProcessed: 1247,
    },
    {
        id: "USR_002",
        name: "John Doe",
        email: "john.doe@company.com",
        role: "Reviewer",
        status: "Active",
        lastActive: "2024-02-15 12:18",
        documentsProcessed: 856,
    },
    {
        id: "USR_003",
        name: "Sarah Wilson",
        email: "sarah.wilson@company.com",
        role: "User",
        status: "Active",
        lastActive: "2024-02-14 16:45",
        documentsProcessed: 432,
    },
    {
        id: "USR_004",
        name: "Mike Johnson",
        email: "mike.johnson@company.com",
        role: "Reviewer",
        status: "Active",
        lastActive: "2024-02-15 09:22",
        documentsProcessed: 689,
    },
    {
        id: "USR_005",
        name: "Emily Brown",
        email: "emily.brown@company.com",
        role: "User",
        status: "Inactive",
        lastActive: "2024-01-28 11:05",
        documentsProcessed: 156,
    },
    {
        id: "USR_006",
        name: "David Lee",
        email: "david.lee@company.com",
        role: "User",
        status: "Pending",
        lastActive: "Never",
        documentsProcessed: 0,
    },
];

const ROLE_COLORS: Record<string, string> = {
    Admin: "bg-primary-light text-primary",
    Reviewer: "bg-blue-100 text-blue-700",
    User: "bg-gray-100 text-gray-700",
};

const STATUS_COLORS: Record<string, string> = {
    Active: "bg-primary-light text-primary",
    Inactive: "bg-gray-100 text-gray-500",
    Pending: "bg-warning/10 text-warning",
};

export function UsersRoles() {
    return (
        <div className="flex flex-col h-full bg-[#f9fafb]">
            <Header title="USERS & ROLES" />

            <div className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Top Bar Actions */}
                    <div className="flex items-center justify-between pb-4 border-b border-border/60">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-text-secondary font-medium text-xs uppercase tracking-wider">Filter By:</span>
                                <div className="flex items-center border border-border bg-white rounded flex-row gap-2 px-3 py-1.5 cursor-pointer hover:bg-surface">
                                    Role: All <ChevronDown className="w-4 h-4 text-text-secondary" />
                                </div>
                                <div className="flex items-center border border-border bg-white rounded flex-row gap-2 px-3 py-1.5 cursor-pointer hover:bg-surface">
                                    Status: All <ChevronDown className="w-4 h-4 text-text-secondary" />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-row items-center gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    className="pl-9 pr-4 py-2 border border-border rounded w-64 text-sm focus:outline-none focus:ring-1 focus:ring-primary h-10"
                                />
                            </div>
                            <button className="bg-primary hover:bg-primary-hover text-white flex items-center gap-2 px-5 font-bold tracking-wide h-10 text-sm transition-colors rounded">
                                <UserPlus className="w-4 h-4" strokeWidth={3} /> INVITE USER
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-lg border border-border shadow-sm">
                            <p className="text-sm text-text-secondary">Total Users</p>
                            <p className="text-2xl font-bold text-text-primary">24</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-border shadow-sm">
                            <p className="text-sm text-text-secondary">Admins</p>
                            <p className="text-2xl font-bold text-text-primary">3</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-border shadow-sm">
                            <p className="text-sm text-text-secondary">Reviewers</p>
                            <p className="text-2xl font-bold text-text-primary">8</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-border shadow-sm">
                            <p className="text-sm text-text-secondary">Pending Invites</p>
                            <p className="text-2xl font-bold text-text-primary">2</p>
                        </div>
                    </div>

                    {/* Sorting / Meta row */}
                    <div className="flex justify-between items-center text-sm text-text-secondary">
                        <div>Showing <span className="font-bold text-text-primary">1-6</span> of 24 users</div>
                        <div className="flex items-center gap-1.5 cursor-pointer">
                            <ListFilter className="w-4 h-4" />
                            Sort: Last Active
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden">
                        <table className="min-w-full divide-y divide-border">
                            <thead className="bg-surface">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Last Active</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Docs Processed</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-border">
                                {MOCK_USERS.map((user) => (
                                    <tr key={user.id} className="hover:bg-surface/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-surface border border-border flex items-center justify-center text-sm font-medium text-text-primary">
                                                    {user.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-text-primary">{user.name}</p>
                                                    <p className="text-xs text-text-secondary">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${ROLE_COLORS[user.role]}`}>
                                                {user.role === 'Admin' && <Shield className="w-3 h-3" />}
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${STATUS_COLORS[user.status]}`}>
                                                {user.status === 'Active' && <CheckCircle className="w-3 h-3" />}
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                                            {user.lastActive}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary font-medium">
                                            {user.documentsProcessed.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <button className="p-1.5 text-text-secondary hover:text-primary hover:bg-primary-light rounded transition-colors" title="Send Email">
                                                    <Mail className="w-4 h-4" />
                                                </button>
                                                <button className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-surface rounded transition-colors" title="More Options">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
