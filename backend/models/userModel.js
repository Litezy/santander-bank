module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user', {
        firstname: {type: DataTypes.STRING},
        lastname: {type: DataTypes.STRING},
        kyc: {type: DataTypes.STRING, defaultValue:'unverified'},
        email: {type: DataTypes.STRING},
        image: {type: DataTypes.STRING},
        role: {type: DataTypes.STRING, defaultValue: 'user'},
        balance: {type: DataTypes.FLOAT, defaultValue: 0},
        currency: {type: DataTypes.STRING},
        dial_code: {type: DataTypes.STRING},
        phone: {type: DataTypes.STRING},
        password: {type: DataTypes.STRING},
        reset_code: {type: DataTypes.STRING, allowNull: true},
        status: {type: DataTypes.STRING, defaultValue: 'offline'},
        gender:{type: DataTypes.STRING, allowNull:false},
        verified: {type: DataTypes.STRING, defaultValue: 'false'},
        suspended: {type: DataTypes.STRING, defaultValue: 'false'},
        lastlogin: {type: DataTypes.STRING, allowNull: true},
        account_number: {type: DataTypes.STRING, allowNull: true},
        country: {type: DataTypes.STRING, allowNull: true},
        state: {type: DataTypes.STRING, allowNull: true},
    })
}