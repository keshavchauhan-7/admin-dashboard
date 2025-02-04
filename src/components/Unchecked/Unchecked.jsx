import { motion } from "framer-motion";
import { Search, ArrowUp, ArrowDown } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

const Unchecked = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [teams, setTeams] = useState([]);
  const [sortConfig, setSortConfig] = useState({ 
    key: null, 
    direction: 'ascending' 
  });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = () => {
    axios
      .get("http://localhost:5000/api/Unchecked-registrations")
      .then((response) => {
        setTeams(response.data);
        setFilteredTeams(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  };

  const handleCheckStatusUpdate = (teamId, currentCheckedInStatus) => {
    const apiRoute = currentCheckedInStatus 
      ? `http://localhost:5000/api/checkout/${teamId}`
      : `http://localhost:5000/api/registrations/checkin/${teamId}`;

    axios
      .put(apiRoute)
      .then(() => {
        fetchTeams();
      })
      .catch((error) => {
        console.error("Error updating check-in status: ", error);
      });
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = teams.filter(
      (team) =>
        team.teamName.toLowerCase().includes(term) ||
        team.teamLeader.name.toLowerCase().includes(term) ||
        team.teamMembers.some((member) =>
          member.name.toLowerCase().includes(term)
        )
    );

    setFilteredTeams(filtered);
  };

  const handleSort = (key) => {
    // If clicking the same column, toggle direction
    if (sortConfig.key === key) {
      const direction = sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
      setSortConfig({ key, direction });
    } 
    // If clicking a new column, set to ascending
    else {
      setSortConfig({ key, direction: 'ascending' });
    }

    const sortedTeams = [...filteredTeams].sort((a, b) => {
      switch(key) {
        case 'teamName':
          return sortConfig.direction === 'ascending'
            ? a.teamName.localeCompare(b.teamName)
            : b.teamName.localeCompare(a.teamName);
        case 'teamLeader':
          return sortConfig.direction === 'ascending'
            ? a.teamLeader.name.localeCompare(b.teamLeader.name)
            : b.teamLeader.name.localeCompare(a.teamLeader.name);
        case 'teamMembers':
          const aMemberNames = a.teamMembers.map(m => m.name).join(', ');
          const bMemberNames = b.teamMembers.map(m => m.name).join(', ');
          return sortConfig.direction === 'ascending'
            ? aMemberNames.localeCompare(bMemberNames)
            : bMemberNames.localeCompare(aMemberNames);
        case 'isCheckedin':
          return sortConfig.direction === 'ascending'
            ? (a.isCheckedin === b.isCheckedin ? 0 : a.isCheckedin ? 1 : -1)
            : (a.isCheckedin === b.isCheckedin ? 0 : a.isCheckedin ? -1 : 1);
        default:
          return 0;
      }
    });

    setFilteredTeams(sortedTeams);
  };

  const handleResetSort = () => {
    // Reset to original data without sorting
    setFilteredTeams(teams);
    setSortConfig({ key: null, direction: 'ascending' });
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 
          className="text-xl font-semibold text-gray-100 cursor-pointer hover:text-gray-300"
          onClick={handleResetSort}
        >
          Team List
        </h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search teams..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearch}
            value={searchTerm}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-700"
                onClick={() => handleSort('teamName')}
              >
                <div className="flex items-center">
                  Team Name
                  {sortConfig.key === 'teamName' && (
                    sortConfig.direction === 'ascending' 
                      ? <ArrowUp size={14} className="ml-2" /> 
                      : <ArrowDown size={14} className="ml-2" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-700"
                onClick={() => handleSort('teamLeader')}
              >
                <div className="flex items-center">
                  Team Leader
                  {sortConfig.key === 'teamLeader' && (
                    sortConfig.direction === 'ascending' 
                      ? <ArrowUp size={14} className="ml-2" /> 
                      : <ArrowDown size={14} className="ml-2" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-700"
                onClick={() => handleSort('teamMembers')}
              >
                <div className="flex items-center">
                  Members
                  {sortConfig.key === 'teamMembers' && (
                    sortConfig.direction === 'ascending' 
                      ? <ArrowUp size={14} className="ml-2" /> 
                      : <ArrowDown size={14} className="ml-2" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-700"
                onClick={() => handleSort('isCheckedin')}
              >
                <div className="flex items-center">
                  Checked In
                  {sortConfig.key === 'isCheckedin' && (
                    sortConfig.direction === 'ascending' 
                      ? <ArrowUp size={14} className="ml-2" /> 
                      : <ArrowDown size={14} className="ml-2" />
                  )}
                </div>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {filteredTeams.map((team) => (
              <motion.tr
                key={team._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                  {team.teamName}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {team.teamLeader.name}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {team.teamMembers.map((member) => member.name).join(", ")}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <input 
                    type="checkbox" 
                    checked={team.isCheckedin} 
                    onChange={() => handleCheckStatusUpdate(team._id, team.isCheckedin)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Unchecked;