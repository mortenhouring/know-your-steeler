// Pittsburgh Steelers Current Roster (2024 Season)
// This includes key players with their jersey numbers
const STEELERS_PLAYERS = [
    // Quarterbacks
    { name: "Russell Wilson", number: 3, position: "QB" },
    { name: "Justin Fields", number: 2, position: "QB" },
    { name: "Kyle Allen", number: 8, position: "QB" },

    // Running Backs
    { name: "Najee Harris", number: 22, position: "RB" },
    { name: "Jaylen Warren", number: 30, position: "RB" },
    { name: "Cordarrelle Patterson", number: 84, position: "RB" },

    // Wide Receivers
    { name: "George Pickens", number: 14, position: "WR" },
    { name: "Calvin Austin III", number: 19, position: "WR" },
    { name: "Van Jefferson", number: 18, position: "WR" },
    { name: "Scotty Miller", number: 16, position: "WR" },
    { name: "Mike Williams", number: 7, position: "WR" },

    // Tight Ends
    { name: "Pat Freiermuth", number: 88, position: "TE" },
    { name: "Darnell Washington", number: 11, position: "TE" },
    { name: "Connor Heyward", number: 83, position: "TE" },

    // Offensive Line
    { name: "Dan Moore Jr.", number: 65, position: "OT" },
    { name: "Broderick Jones", number: 79, position: "OT" },
    { name: "Isaac Seumalo", number: 56, position: "G" },
    { name: "Mason McCormick", number: 71, position: "G" },
    { name: "Troy Fautanu", number: 76, position: "G" },
    { name: "Zach Frazier", number: 54, position: "C" },
    { name: "Nate Herbig", number: 61, position: "G" },

    // Defensive Line
    { name: "Cameron Heyward", number: 97, position: "DT" },
    { name: "T.J. Watt", number: 90, position: "OLB" },
    { name: "Alex Highsmith", number: 56, position: "OLB" },
    { name: "Nick Herbig", number: 51, position: "OLB" },
    { name: "Preston Smith", number: 91, position: "OLB" },
    { name: "Keeanu Benton", number: 95, position: "DT" },
    { name: "Larry Ogunjobi", number: 99, position: "DT" },
    { name: "Montravius Adams", number: 92, position: "DT" },

    // Linebackers
    { name: "Patrick Queen", number: 6, position: "LB" },
    { name: "Elandon Roberts", number: 50, position: "LB" },
    { name: "Payton Wilson", number: 1, position: "LB" },

    // Defensive Backs
    { name: "Joey Porter Jr.", number: 24, position: "CB" },
    { name: "Donte Jackson", number: 26, position: "CB" },
    { name: "Cory Trice Jr.", number: 23, position: "CB" },
    { name: "Minkah Fitzpatrick", number: 39, position: "S" },
    { name: "DeShon Elliott", number: 28, position: "S" },
    { name: "Damontae Kazee", number: 29, position: "S" },
    { name: "Terrell Edmunds", number: 34, position: "S" },

    // Special Teams
    { name: "Chris Boswell", number: 9, position: "K" },
    { name: "Cameron Johnston", number: 4, position: "P" },
    { name: "Christian Kuntz", number: 46, position: "LS" },

    // Additional Notable Players
    { name: "Cam Sutton", number: 20, position: "CB" },
    { name: "Beanie Bishop Jr.", number: 41, position: "CB" },
    { name: "Ryan McCollum", number: 69, position: "G" },
    { name: "Spencer Anderson", number: 68, position: "T" },
    { name: "Ben Skowronek", number: 85, position: "WR" },
    { name: "Tyler Matakevich", number: 44, position: "LB" },
    { name: "Miles Killebrew", number: 35, position: "S" },
    { name: "Kyahva Tezino", number: 48, position: "LB" },
    { name: "Marcus Haynes", number: 98, position: "DE" },
    { name: "Isaiahh Loudermilk", number: 96, position: "DE" },
    { name: "Dean Lowry", number: 94, position: "DT" },
    { name: "Jacob Phillips", number: 45, position: "LB" },
    { name: "Jonathan Ward", number: 21, position: "RB" },
    { name: "Aaron Shampklin", number: 27, position: "RB" },
    { name: "Dez Fitzpatrick", number: 15, position: "WR" },
    { name: "Lance McCutcheon", number: 17, position: "WR" },
    { name: "Rodney Williams", number: 82, position: "TE" },
    { name: "Matt Canada", number: 81, position: "TE" }
];

// Export for use in the main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { STEELERS_PLAYERS };
}