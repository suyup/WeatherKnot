
Date.today = function() {
    const date = new Date();
    return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
};

exports.toEpoch = function(date) {
    return Date.parse(date);
};

exports.toDate = function(epoch) {
    const date = new Date(0);
    date.setUTCSeconds(epoch);
    return date;
};
