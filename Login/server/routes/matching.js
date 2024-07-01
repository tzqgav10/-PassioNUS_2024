const router = require("express").Router();
const collection = require("../models/config");
const Interest = require("../models/interests");

// Endpoint to find the best match based on interests
router.get('/best-match', async (req, res) => {
    try {
        const bestMatch = await findBestMatch();
        if (!bestMatch) {
            return res.status(200).json({ message: "There are not enough users or there are no matches found. Please try again later." });
        }
        res.status(200).json(bestMatch);
    } catch (error) {
        console.error('Error finding best match:', error);
        res.status(500).send({ message: 'Server error' });
    }
});

// Function to find the best match
async function findBestMatch() {
    try {
        const interests = await Interest.find();
        console.log('Interests fetched:', interests);

        if (interests.length < 2) {
            return null;
        }

        let bestMatch = null;
        let maxMatches = -1;

        for (let i = 0; i < interests.length - 1; i++) {
            for (let j = i + 1; j < interests.length; j++) {
                const matches = countMatches(interests[i], interests[j]);

                if (matches > maxMatches) {
                    maxMatches = matches;
                    bestMatch = {
                        user1: interests[i].userId,
                        user2: interests[j].userId,
                        matches
                    };
                }
            }
        }

        if (bestMatch) {
            const user1 = await collection.findOne({ userId: bestMatch.user1 });
            const user2 = await collection.findOne({ userId: bestMatch.user2 });
            bestMatch.user1 = user1.name;
            bestMatch.user2 = user2.name;
        }

        console.log('Best match found:', bestMatch);
        return bestMatch;
    } catch (error) {
        console.error('Error in findBestMatch:', error);
        throw new Error('Error finding best match');
    }
}

function countMatches(user1, user2) {
    const interests = ['Sports', 'Music', 'Art', 'Cooking', 'Volunteering', 'Video_Games', 'Dance'];
    let matches = 0;

    interests.forEach(interest => {
        if (user1[interest] && user2[interest]) {
            matches++;
        }
    });

    return matches;
}

module.exports = router;
