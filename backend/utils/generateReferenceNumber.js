function generateReferenceNumber() {
    const timestamp = Date.now(); // ms since epoch
    const random = Math.floor(Math.random() * 10000); // 4-digit random
    return `YFH-${timestamp}-${random}`;
}

module.exports = { generateReferenceNumber };
