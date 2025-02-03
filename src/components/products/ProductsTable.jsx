import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

const ProductsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = () => {
    axios
      .get("http://localhost:5000/api/registrations")
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

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Team List</h2>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Team Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Team Leader
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Members
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Checked In
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

export default ProductsTable;