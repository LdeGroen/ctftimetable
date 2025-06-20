import React, { useState, useEffect } from 'react';

// De hoofdcomponent van de applicatie
const App = () => {
  // Voorbeelddata voor de timetable, bijgewerkt met de nieuwe datums en links
  const [timetable, setTimetable] = useState([
    {
      date: 'Vrijdag 21 juni 2025',
      events: [
        { time: '14:00', title: 'ROC Creative College - The man with two faces', location: 'De Nijverheid', url: 'https://cafetheaterfestival.nl/utrecht/programma/roc-creative-college/' },
        { time: '15:30', title: 'Chen Chieh & Camiel - Antoniemen', location: 'De Nijverheid', url: 'https://cafetheaterfestival.nl/utrecht/programma/chen-chieh-camiel/' },
      ],
    },
    {
      date: 'Zondag 6 juli 2025',
      events: [
        { time: '14:00', title: 'Oumar Jalloh - Ugly', location: 'De Nijverheid', url: 'https://cafetheaterfestival.nl/utrecht/programma/oumar-jalloh/' },
        { time: '16:00', title: 'Geoffrey van der Ven - Anders ik wel...', location: 'De Nijverheid', url: 'https://cafetheaterfestival.nl/utrecht/programma/geoffrey-van-der-ven/' },
      ],
    },
    {
      date: 'Vrijdag 18 juli 2025',
      events: [
        { time: '14:30', title: 'OOPSIE DAISY - Broadway Baby', location: 'De Nijverheid', url: 'https://cafetheaterfestival.nl/utrecht/programma/oopsie-daisy/' },
        { time: '17:00', title: 'Bi&deLes - De Lesbie', location: 'De Nijverheid', url: 'https://cafetheaterfestival.nl/utrecht/programma/bideles-2/' },
      ],
    },
    {
      date: 'Zondag 27 juli 2025',
      events: [
        { time: '13:00', title: 'Lariekoek - Koffie verkeerd', location: 'De Nijverheid', url: 'https://cafetheaterfestival.nl/utrecht/programma/lariekoek/' },
        { time: '15:00', title: 'Arina Kornyeyeva & Gaby Berger - Tot hier', location: 'De Nijverheid', url: 'https://cafetheaterfestival.nl/utrecht/programma/arina-kornyeyeva-gaby-berger/' },
      ],
    },
    {
      date: 'Vrijdag 1 augustus 2025',
      events: [
        { time: '19:00', title: 'Keshaw - Metamorphosis. The Art of Dying', location: 'De Nijverheid', url: 'https://cafetheaterfestival.nl/utrecht/programma/keshaw/' },
        { time: '21:00', title: '4MEN - The untouchables', location: 'De Nijverheid', url: 'https://cafetheaterfestival.nl/utrecht/programma/4men/' },
      ],
    },
    {
      date: 'Vrijdag 15 augustus 2025', // Deze datum moet 15 augustus blijven zoals in de oorspronkelijke lijst
      events: [
        { time: '14:00', title: 'Nader Te Bepalen Voorstelling 1', location: 'De Nijverheid' },
        { time: '16:30', title: 'Nader Te Bepalen Voorstelling 2', location: 'De Nijverheid' },
      ],
    },
    {
      date: 'Donderdag 11 september 2025',
      events: [
        { time: '15:30', title: 'Mirjam Ravier - A year of solitude', location: 'De Nijverheid', url: 'https://cafetheaterfestival.nl/utrecht/programma/mirjam-ravier-6/' },
        { time: '18:00', title: 'Dorrit Griffioen - Stilte Tussen Ons', location: 'De Nijverheid', url: 'https://cafetheaterfestival.nl/utrecht/programma/dorrit-griffioen/' },
      ],
    },
    {
      date: 'Zondag 28 september 2025',
      events: [
        { time: '13:00', title: 'Elke Thelissen - Glashelder', location: 'De Nijverheid', url: 'https://cafetheaterfestival.nl/utrecht/programma/elke-thelissen-4/' },
        { time: '15:00', title: 'Isabel Schoonbeek - Donna // de reconstructie van een deurpost', location: 'De Nijverheid', url: 'https://cafetheaterfestival.nl/utrecht/programma/isabel-schoonbeek/' },
      ],
    },
    {
      date: 'Vrijdag 14 november 2025',
      events: [
        { time: '19:00', title: 'Amit Palgi & Pia Mačerol - Attached', location: 'De Nijverheid', url: 'https://cafetheaterfestival.nl/utrecht/programma/amit-palgi-pia-macerol-2/' },
        { time: '21:00', title: 'Gerrit & Mahat - Een poetisch rommeltje', location: 'De Nijverheid', url: 'https://cafetheaterfestival.nl/arnhem/programma/gerrit-mahat-2/' },
      ],
    },
    {
      date: 'Vrijdag 28 november 2025',
      events: [
        { time: '14:00', title: 'Albert Meijer - Plukjes', location: 'De Nijverheid', url: 'https://cafetheaterfestival.nl/utrecht/programma/albert-meijer/' },
        { time: '16:00', title: 'Sytze Bouma - Drag me home', location: 'De Nijverheid', url: 'https://cafetheaterfestival.nl/utrecht/programma/sytze-bouma/' },
      ],
    },
  ]);

  // State om de huidige geselecteerde dag bij te houden
  const [selectedDay, setSelectedDay] = useState(timetable[0].date);
  // States voor de iframe modal
  const [showIframeModal, setShowIframeModal] = useState(false);
  const [iframeUrl, setIframeUrl] = useState('');

  // Zorgt ervoor dat de pagina naar boven scrollt bij het laden
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Functie om de iframe modal te openen
  const openIframeModal = (url) => {
    setIframeUrl(url);
    setShowIframeModal(true);
  };

  // Functie om de iframe modal te sluiten
  const closeIframeModal = () => {
    setIframeUrl('');
    setShowIframeModal(false);
  };

  return (
    // Hoofdcontainer met de ingestelde achtergrondkleur en responsieve padding
    <div className="min-h-screen bg-[#20747f] font-sans text-white p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      {/* Titel van de app */}
      <h1 className="text-4xl sm:text-5xl font-bold text-center mb-6 mt-4">
        CTF x de Nijverheid Timetable
      </h1>

      {/* Navigatie voor de dagen */}
      <div className="flex flex-wrap justify-center gap-3 mb-8 w-full max-w-2xl">
        {timetable.map((day) => (
          <button
            key={day.date}
            onClick={() => setSelectedDay(day.date)}
            className={`
              px-5 py-3 rounded-xl shadow-lg transition-all duration-300 ease-in-out
              ${selectedDay === day.date
                ? 'bg-white text-[#20747f] font-semibold scale-105' // Actieve knop stijl
                : 'bg-gray-800 text-white hover:bg-gray-700' // Inactieve knop stijl
              }
            `}
          >
            {day.date}
          </button>
        ))}
      </div>

      {/* Container voor de evenementen van de geselecteerde dag */}
      <div className="w-full max-w-3xl bg-white bg-opacity-90 rounded-2xl shadow-xl p-6 sm:p-8">
        {timetable.find(day => day.date === selectedDay)?.events.map((event, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between
                       bg-white p-4 mb-4 rounded-xl shadow-md transition-transform duration-200 ease-in-out transform hover:scale-[1.02]"
          >
            {/* Tijd en titel van het evenement */}
            <div className="flex-1 mb-2 sm:mb-0">
              <p className="text-gray-600 text-sm font-medium">{event.time}</p>
              {/* De titel wordt een klikbaar element als er een URL is */}
              {event.url ? (
                <h3
                  className="text-lg sm:text-xl font-bold text-[#20747f] cursor-pointer hover:underline"
                  onClick={() => openIframeModal(event.url)}
                >
                  {event.title}
                </h3>
              ) : (
                <h3 className="text-lg sm:text-xl font-bold text-[#20747f]">
                  {event.title}
                </h3>
              )}
            </div>
            {/* Locatie van het evenement */}
            <div className="flex items-center text-gray-700 text-sm sm:text-base">
              {/* Lucide icon voor locatie */}
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin mr-1">
                <path d="M18 8c0 4.5-6 9-6 9s-6-4.5-6-9a6 6 0 0 1 12 0Z"/><circle cx="12" cy="8" r="2"/>
              </svg>
              <span>{event.location}</span>
            </div>
          </div>
        ))}
        {/* Bericht als er geen evenementen zijn voor de geselecteerde dag */}
        {timetable.find(day => day.date === selectedDay)?.events.length === 0 && (
          <p className="text-gray-700 text-center text-lg mt-8">
            Geen evenementen gepland voor deze dag.
          </p>
        )}
      </div>

      {/* Iframe Modal */}
      {showIframeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl h-5/6 overflow-hidden flex flex-col">
            <button
              onClick={closeIframeModal}
              className="absolute top-3 right-3 bg-red-600 text-white rounded-full p-2 w-8 h-8 flex items-center justify-center text-lg font-bold hover:bg-red-700 z-10"
              aria-label="Sluit"
            >
              &times;
            </button>
            <iframe
              src={iframeUrl}
              title="Festival Informatie"
              className="w-full flex-grow border-0 rounded-b-lg"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
