import React, { useEffect, useMemo, useState, useCallback } from 'react'
import axios from 'axios'
import Leadform from '../components/Leadform'
import LeadRow from '../components/LeadRow'
function Leadlist() {

    const [leads, setleads] = useState([])
    const [open, setOpen] = useState(false)
    const [editinglead, setEditinglead] = useState({})
    const [isEditing, setIsEditing] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const [filteredStatus, setfilteredStatus] = useState('')

    const getLeads = async () => {
        try {
            const response = await axios.get('https://jsonplaceholder.typicode.com/users')
            const leadsWithStatus = response.data.map(lead => ({
                ...lead,
                status: 'New',
                notes: ''
            }));

            setleads(leadsWithStatus);
            console.log(leadsWithStatus)
        } catch (error) {
            console.error(error)
        }

    }

    useEffect(() => {
        if (leads.length === 0) return;

        localStorage.setItem(
            'leadsData',
            JSON.stringify(leads)
        );
    }, [leads]);

    useEffect(() => {
        const timeout = setTimeout(() => {

            const stateToStore = {
                searchValue,
                filteredStatus
            };

            localStorage.setItem(
                'leadsStorageKey',
                JSON.stringify(stateToStore)
            );

        }, 300);

        return () => clearTimeout(timeout);

    }, [searchValue, filteredStatus]);

    useEffect(() => {
        const store = localStorage.getItem('leadsStorageKey');
        if (!store) return;

        try {
            const parse = JSON.parse(store);

            setSearchValue(parse.searchValue ?? '');
            setfilteredStatus(parse.filteredStatus ?? '');

        } catch (error) {
            console.log('Failed to parse localStorage:', error);
        }

    }, []);

    useEffect(() => {
        const storedLeads = localStorage.getItem('leadsData');

        if (storedLeads) {
            try {
                setleads(JSON.parse(storedLeads));
                return; 
            } catch (error) {
                console.log('Failed to restore leads:', error);
            }
        }

        getLeads(); 
        

    }, []);

    const handleSubmit = useCallback((newLead) => {
        setleads(prev => [...prev, {
            id: Math.max(...prev.map(l => l.id), 0) + 1,
            name: newLead.name,
            email: newLead.email,
            phone: newLead.phone,
            company: { name: newLead.company },
            website: newLead.leadSource,
            status: newLead.leadStatus,
            notes: newLead.notes ?? ''
        }])
        setOpen(false)
    }, [])

    const handleDelete = useCallback((id) => {
        setleads((leads) => {
            return leads.filter(lead => lead.id !== id)
        })
    }, [])

    const handleEdit = (lead) => {
        setEditinglead(lead)
        setIsEditing(true)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        console.log(name, value)
        console.log(editinglead)

        setEditinglead(lead => ({
            ...lead,
            ...(name === 'company'
                ? { company: { ...lead.company, name: value } }
                : { [name]: value })
        }))
    }

    const handleSave = () => {
        const allLeads = leads.slice()
        const newLeads = allLeads.map((lead) => {
            return lead.id === editinglead.id ? editinglead : lead
        })
        setleads(newLeads)
        console.log(newLeads)
        setIsEditing(false)
        setEditinglead({})
    }

   
    let filteredLeads = useMemo(()=>{
        return leads.filter((lead) => {

        if (!(searchValue.trim()) && !filteredStatus) return true;


        if (filteredStatus && searchValue) {
            return (
                lead.status === filteredStatus &&
                (
                    lead.name.toLowerCase().includes(searchValue) ||
                    lead.company?.name?.toLowerCase().includes(searchValue)
                )
            );
        }
        else if (filteredStatus) {
            return lead.status === filteredStatus;
        }
        else {
            return (
                lead.name.toLowerCase().includes(searchValue) ||
                lead.company?.name?.toLowerCase().includes(searchValue)
            );
        }
    })},[searchValue,filteredStatus,leads]);

    console.log(filteredLeads)

    const handleSearch = useCallback((name) => {
        const value = name.toLowerCase()
        console.log(value)
        setSearchValue(value)

    }, [])

    const handleDownloadCSV = useCallback(() => {

    if (!filteredLeads.length) {
        alert('No leads to download');
        return;
    }

const headers = ['ID', 'Name', 'Email', 'Phone', 'Company', 'Lead Source', 'Status', 'Notes'];

        const rows = filteredLeads.map(lead => [
            lead.id,
            lead.name,
            lead.email,
            lead.phone,
            lead.company?.name ?? '',
            lead.website ?? '',
            lead.status,
            lead.notes ?? ''
    ]);

    const csvContent = [headers, ...rows]
        .map(row =>
            row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(',')
        )
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `leads_${filteredStatus || 'all'}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

}, [filteredLeads, filteredStatus]);

    const handleStatusFilter = useCallback((statusFilter) => {
        console.log(statusFilter)
        setfilteredStatus(statusFilter)
    }, [])

    const handleStatusChange = useCallback((id, status) => {

        setleads((prev) => {
            return prev.map(lead =>
                lead.id === id ? { ...lead, status: status } : lead
            )
        })

        setEditinglead(prev =>
            prev.id === id ? { ...prev, status } : prev
        )

    }, [])
    console.log(leads)

    return (
        <>
            {open && (
                <Leadform onClose={() => setOpen(false)} onSubmit={handleSubmit} />
            )}

            <div className={` ${open ? 'opacity-50' : ''} min-h-screen pt-16`}>
                <div className='flex gap-6 mt-2.5 ml-4 justify-baseline'>
                    <select value={filteredStatus} onChange={(e) => handleStatusFilter(e.target.value)} name="Status" className="px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                        <option value="">Filter By</option>
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Follow-up">Follow-up</option>
                        <option value="Converted">Converted</option>
                        <option value="Lost">Lost</option>
                    </select>
                    <span className='flex justify-center items-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'>

                        <input
                            value={searchValue}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="px-3 py-2 pr-6 focus:outline-none"
                            type="text"
                            placeholder='Search by Name, Company name'

                        />
                        <svg
                            className="mr-3 w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </span>

                    <span className=''>
                        <button onClick={() => setOpen(true)} className='cursor-pointer  px-2 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'>Add Lead 📃</button>
                    </span>

                    <span className=''>
                        <button onClick={handleDownloadCSV} className='cursor-pointer px-2 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm'>Download CSV ⬇️</button>
                    </span>

                </div>
                <div className="overflow-x-auto mx-8 my-6 bg-white rounded-lg shadow-sm border border-gray-200">
                    <table className="w-full h-full text-sm ">
                        <thead className="bg-indigo-100 text-indigo-900">
                            <tr>
                                <th className="p-4 text-left font-semibold">Sr no.</th>
                                <th className="p-4 text-left font-semibold">Name</th>
                                <th className="p-4 text-left font-semibold">Email</th>
                                <th className="p-4 text-left font-semibold">Phone No.</th>
                                <th className="p-4 text-left font-semibold">Company name</th>
                                <th className="p-4 text-left font-semibold">Lead Source</th>
                                <th className="p-4 text-left font-semibold">Lead Status</th>
                                <th className="p-4 text-left font-semibold">Notes</th>
                                <th className="p-4 text-left font-semibold">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredLeads.map((lead) =>
                                <LeadRow
                                    key={lead.id}
                                    lead={lead}
                                    isEditing={isEditing}
                                    editinglead={editinglead}
                                    handleChange={handleChange}
                                    handleStatusChange={handleStatusChange}
                                    handleSave={handleSave}
                                    handleEdit={handleEdit}
                                    handleDelete={handleDelete}
                                />
                            )}
                        </tbody>
                    </table>

                </div>
            </div >
        </>
    )
}

export default Leadlist