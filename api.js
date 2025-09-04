// API Module for Steelers Data Management
class SteelersAPI {
    constructor() {
        this.baseURL = 'https://api.sleeper.app/v1';
        this.currentPlayers = [];
        this.newFaces = [];
        this.legends = [];
        this.cache = new Map();
        this.lastFetch = null;
        this.cacheTimeout = 1000 * 60 * 30; // 30 minutes
    }

    // Fetch current roster from Sleeper API
    async fetchCurrentRoster() {
        try {
            const cacheKey = 'current_roster';
            const cached = this.getCachedData(cacheKey);
            if (cached) return cached;

            // Try to fetch from Sleeper API
            const response = await fetch(`${this.baseURL}/players/nfl`);
            if (!response.ok) throw new Error('Network response was not ok');
            
            const allPlayers = await response.json();
            
            // Filter for Pittsburgh Steelers players
            const steelersPlayers = Object.values(allPlayers).filter(player => 
                player.team === 'PIT' && player.active === true
            ).map(player => ({
                name: `${player.first_name} ${player.last_name}`,
                number: player.number || 0,
                position: player.position || 'N/A',
                age: player.age || 0,
                experience: player.years_exp || 0,
                college: player.college || 'N/A'
            }));

            this.setCachedData(cacheKey, steelersPlayers);
            return steelersPlayers;
        } catch (error) {
            console.warn('Failed to fetch from Sleeper API, using fallback data:', error);
            return this.getFallbackCurrentPlayers();
        }
    }

    // Get new faces (players with less than 2 years experience or recent acquisitions)
    async getCurrentPlayers() {
        const roster = await this.fetchCurrentRoster();
        return roster;
    }

    async getNewFaces() {
        const roster = await this.fetchCurrentRoster();
        return roster.filter(player => 
            player.experience <= 1 || this.isRecentAcquisition(player)
        );
    }

    // Check if player is a recent acquisition (this would be enhanced with more data)
    isRecentAcquisition(player) {
        const recentAcquisitions = [
            'Russell Wilson', 'Justin Fields', 'Van Jefferson', 'Mike Williams',
            'Patrick Queen', 'Donte Jackson', 'DeShon Elliott', 'Cameron Johnston'
        ];
        return recentAcquisitions.includes(player.name);
    }

    // Get team legends data
    async getTeamLegends() {
        const cacheKey = 'team_legends';
        const cached = this.getCachedData(cacheKey);
        if (cached) return cached;

        const legends = this.getStaticLegends();
        this.setCachedData(cacheKey, legends);
        return legends;
    }

    // Fetch trivia for a specific legend
    async getLegendTrivia(playerName) {
        const cacheKey = `trivia_${playerName}`;
        const cached = this.getCachedData(cacheKey);
        if (cached) return cached;

        // In a real implementation, this would fetch from a trivia API or database
        const trivia = this.getStaticTrivia(playerName);
        this.setCachedData(cacheKey, trivia);
        return trivia;
    }

    // Cache management
    getCachedData(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }
        return null;
    }

    setCachedData(key, data) {
        this.cache.set(key, {
            data: data,
            timestamp: Date.now()
        });
    }

    // Fallback data when API is unavailable
    getFallbackCurrentPlayers() {
        return [
            // Quarterbacks
            { name: "Russell Wilson", number: 3, position: "QB", age: 35, experience: 12, college: "Wisconsin" },
            { name: "Justin Fields", number: 2, position: "QB", age: 25, experience: 3, college: "Ohio State" },
            { name: "Kyle Allen", number: 8, position: "QB", age: 28, experience: 6, college: "Houston" },

            // Running Backs
            { name: "Najee Harris", number: 22, position: "RB", age: 26, experience: 3, college: "Alabama" },
            { name: "Jaylen Warren", number: 30, position: "RB", age: 25, experience: 2, college: "Oklahoma State" },
            { name: "Cordarrelle Patterson", number: 84, position: "RB", age: 33, experience: 11, college: "Tennessee" },

            // Wide Receivers
            { name: "George Pickens", number: 14, position: "WR", age: 23, experience: 2, college: "Georgia" },
            { name: "Calvin Austin III", number: 19, position: "WR", age: 25, experience: 2, college: "Memphis" },
            { name: "Van Jefferson", number: 18, position: "WR", age: 28, experience: 4, college: "Florida" },
            { name: "Mike Williams", number: 7, position: "WR", age: 30, experience: 7, college: "Clemson" },

            // Tight Ends
            { name: "Pat Freiermuth", number: 88, position: "TE", age: 25, experience: 3, college: "Penn State" },
            { name: "Darnell Washington", number: 11, position: "TE", age: 22, experience: 1, college: "Georgia" },

            // Defensive Players
            { name: "T.J. Watt", number: 90, position: "OLB", age: 29, experience: 7, college: "Wisconsin" },
            { name: "Minkah Fitzpatrick", number: 39, position: "S", age: 27, experience: 6, college: "Alabama" },
            { name: "Cameron Heyward", number: 97, position: "DT", age: 35, experience: 13, college: "Ohio State" },
            { name: "Alex Highsmith", number: 56, position: "OLB", age: 27, experience: 4, college: "Charlotte" },
            { name: "Patrick Queen", number: 6, position: "LB", age: 25, experience: 4, college: "LSU" },
            { name: "Joey Porter Jr.", number: 24, position: "CB", age: 24, experience: 1, college: "Penn State" },
            { name: "Donte Jackson", number: 26, position: "CB", age: 29, experience: 6, college: "LSU" },

            // Special Teams
            { name: "Chris Boswell", number: 9, position: "K", age: 33, experience: 9, college: "Rice" },
            { name: "Cameron Johnston", number: 4, position: "P", age: 32, experience: 6, college: "Ohio State" }
        ];
    }

    // Static legends data (would be expanded in a real implementation)
    getStaticLegends() {
        return [
            {
                name: "Terry Bradshaw",
                number: 12,
                position: "QB",
                years: "1970-1983",
                achievements: ["4x Super Bowl Champion", "2x Super Bowl MVP", "Hall of Fame"],
                funFact: "First QB to throw for 300+ yards in a Super Bowl"
            },
            {
                name: "Franco Harris",
                number: 32,
                position: "RB",
                years: "1972-1983",
                achievements: ["4x Super Bowl Champion", "Super Bowl IX MVP", "Hall of Fame"],
                funFact: "Famous for the 'Immaculate Reception' in 1972"
            },
            {
                name: "Joe Greene",
                number: 75,
                position: "DT",
                years: "1969-1981",
                achievements: ["4x Super Bowl Champion", "2x Defensive Player of the Year", "Hall of Fame"],
                funFact: "Anchor of the 'Steel Curtain' defense"
            },
            {
                name: "Lynn Swann",
                number: 88,
                position: "WR",
                years: "1974-1982",
                achievements: ["4x Super Bowl Champion", "Super Bowl X MVP", "Hall of Fame"],
                funFact: "Known for his acrobatic catches and ballet background"
            },
            {
                name: "Jack Lambert",
                number: 58,
                position: "LB",
                years: "1974-1984",
                achievements: ["4x Super Bowl Champion", "2x Defensive Player of the Year", "Hall of Fame"],
                funFact: "The toothless intimidator of the Steel Curtain"
            },
            {
                name: "Ben Roethlisberger",
                number: 7,
                position: "QB",
                years: "2004-2021",
                achievements: ["2x Super Bowl Champion", "6x Pro Bowl", "Rookie of the Year"],
                funFact: "Won Super Bowl XL at age 23, youngest QB to win Super Bowl"
            },
            {
                name: "Troy Polamalu",
                number: 43,
                position: "S",
                years: "2003-2014",
                achievements: ["2x Super Bowl Champion", "Defensive Player of the Year", "Hall of Fame"],
                funFact: "Famous for his flowing hair and instinctive play"
            },
            {
                name: "Hines Ward",
                number: 86,
                position: "WR",
                years: "1998-2011",
                achievements: ["2x Super Bowl Champion", "Super Bowl XL MVP", "4x Pro Bowl"],
                funFact: "Known for his blocking and infectious smile"
            }
        ];
    }

    // Static trivia data (would be fetched from an API in real implementation)
    getStaticTrivia(playerName) {
        const triviaData = {
            "Terry Bradshaw": [
                "What college did Terry Bradshaw attend?",
                "How many Super Bowl MVPs did Terry Bradshaw win?",
                "In which year was Terry Bradshaw drafted #1 overall?"
            ],
            "Franco Harris": [
                "What was the famous catch by Franco Harris called?",
                "How many rushing yards did Franco Harris have in his career?",
                "Which Super Bowl did Franco Harris win MVP?"
            ],
            "Joe Greene": [
                "What was Joe Greene's nickname?",
                "How many Pro Bowls did Mean Joe Greene make?",
                "What college did Joe Greene attend?"
            ],
            "Ben Roethlisberger": [
                "How old was Ben Roethlisberger when he won his first Super Bowl?",
                "What was Ben Roethlisberger's nickname?",
                "How many passing yards did Ben Roethlisberger have in his career?"
            ]
        };

        return triviaData[playerName] || [
            "What position did this player play?",
            "How many Super Bowls did this player win?",
            "What years did this player play for the Steelers?"
        ];
    }

    // Error handling wrapper
    async safeApiCall(apiFunction) {
        try {
            return await apiFunction();
        } catch (error) {
            console.error('API call failed:', error);
            throw new Error('Unable to fetch data. Please check your connection and try again.');
        }
    }
}

// Create global instance
window.steelersAPI = new SteelersAPI();