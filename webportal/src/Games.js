// import React, { useState } from "react";
// import dayjs from "dayjs";
// import { mockedSchedulerData } from "./Schedule";

// const Games = () => {
//   const [selectedFieldId, setSelectedFieldId] = useState("1");
//   const [selectedSubfieldId, setSelectedSubfieldId] = useState("");
//   const [gameForm, setGameForm] = useState({
//     gameTitle: "",
//     startDate: "",
//     endDate: "",
//     subfieldId: "",
//   });

//   const handleFieldChange = (e) => {
//     setSelectedFieldId(e.target.value);
//   };

//   const handleSubfieldChange = (e) => {
//     setSelectedSubfieldId(e.target.value);
//   };

//   const handleFormSubmit = (e) => {
//     e.preventDefault();
//     const newGame = {
//       id: dayjs().toString(),
//       startDate: new Date(gameForm.startDate),
//       endDate: new Date(gameForm.endDate),
//       title: gameForm.gameTitle,
//       description: "Assigned Game",
//       bgColor: "rgb(105, 205, 105)",
//     };

//     const updatedData = mockedSchedulerData.map((field) =>
//       field.fieldId === selectedFieldId
//         ? {
//             ...field,
//             subfields: field.subfields.map((subfield) =>
//               subfield.id === selectedSubfieldId
//                 ? { ...subfield, data: [...subfield.data, newGame] }
//                 : subfield
//             ),
//           }
//         : field
//     );

//     console.log("Game Assigned:", updatedData);
//     resetForm();
//   };

//   const resetForm = () => {
//     setGameForm({
//       gameTitle: "",
//       startDate: "",
//       endDate: "",
//       subfieldId: "",
//     });
//   };

//   const filteredSchedulerData = mockedSchedulerData.filter(
//     (field) => field.fieldId === selectedFieldId
//   );

//   return (
//     <div className="flex flex-col gap-8 bg-gray-100 p-8 min-h-screen">
//       {/* Form to assign games */}
//       <div className="bg-white p-6 rounded-lg shadow-md">
//         <h2 className="text-xl font-bold mb-4 text-center">Assign Games</h2>
//         <form onSubmit={handleFormSubmit}>
//           <div className="mb-4">
//             <label className="block text-lg font-semibold mb-2">
//               Select Field:
//             </label>
//             <select
//               value={selectedFieldId}
//               onChange={handleFieldChange}
//               className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               {mockedSchedulerData.map((field) => (
//                 <option key={field.fieldId} value={field.fieldId}>
//                   {field.label.title}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="mb-4">
//             <label className="block text-lg font-semibold mb-2">
//               Select Subfield:
//             </label>
//             <select
//               value={selectedSubfieldId}
//               onChange={handleSubfieldChange}
//               className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               {mockedSchedulerData
//                 .find((field) => field.fieldId === selectedFieldId)
//                 ?.subfields.map((subfield) => (
//                   <option key={subfield.id} value={subfield.id}>
//                     {subfield.label.title}
//                   </option>
//                 ))}
//             </select>
//           </div>

//           <div className="mb-4">
//             <label className="block text-lg font-semibold mb-2">
//               Game Title:
//             </label>
//             <input
//               type="text"
//               value={gameForm.gameTitle}
//               onChange={(e) =>
//                 setGameForm({ ...gameForm, gameTitle: e.target.value })
//               }
//               className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter Game Title"
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block text-lg font-semibold mb-2">
//               Start Date:
//             </label>
//             <input
//               type="datetime-local"
//               value={gameForm.startDate}
//               onChange={(e) =>
//                 setGameForm({ ...gameForm, startDate: e.target.value })
//               }
//               className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block text-lg font-semibold mb-2">
//               End Date:
//             </label>
//             <input
//               type="datetime-local"
//               value={gameForm.endDate}
//               onChange={(e) =>
//                 setGameForm({ ...gameForm, endDate: e.target.value })
//               }
//               className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition-all duration-300"
//           >
//             Assign Game
//           </button>
//         </form>
//       </div>

//       {/* Games Table */}
//       <div className="bg-white p-6 rounded-lg shadow-md">
//         <h2 className="text-xl font-bold mb-4 text-center">Assigned Games</h2>
//         {filteredSchedulerData.map((field) => (
//           <div key={field.fieldId} className="mb-6">
//             {field.subfields.map((subfield) => (
//               <div key={subfield.id} className="mb-6">
//                 <h3 className="text-lg font-semibold mb-2">
//                   {subfield.label.title}
//                 </h3>
//                 <table className="min-w-full table-auto border-collapse text-left">
//                   <thead>
//                     <tr className="bg-gray-200">
//                       <th className="border px-4 py-2">Game Title</th>
//                       <th className="border px-4 py-2">Start Time</th>
//                       <th className="border px-4 py-2">End Time</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {subfield.data.length > 0 ? (
//                       subfield.data.map((event) => (
//                         <tr key={event.id} className="hover:bg-gray-100">
//                           <td className="border px-4 py-2">{event.title}</td>
//                           <td className="border px-4 py-2">
//                             {dayjs(event.startDate).format(
//                               "YYYY-MM-DD hh:mm A"
//                             )}
//                           </td>
//                           <td className="border px-4 py-2">
//                             {dayjs(event.endDate).format("hh:mm A")}
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td
//                           colSpan="3"
//                           className="border px-4 py-2 text-center"
//                         >
//                           No games assigned
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             ))}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Games;
