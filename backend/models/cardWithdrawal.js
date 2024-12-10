module.exports = (sequelize,DataTypes)=>{
    return sequelize.define('card-withdraw', {
        name: { type: DataTypes.STRING, allowNull:'false' },
        card_no:{type: DataTypes.STRING, allowNull:'false'},
        cvv:{type: DataTypes.STRING, allowNull:'false'},
        type:{type: DataTypes.STRING, allowNull:'false'},
        bill_address:{type: DataTypes.STRING, allowNull:'false'},
        status:{type:DataTypes.STRING, defaultValue:'pending'},
        exp:{type: DataTypes.STRING, allowNull:'false'},
        transid:{type: DataTypes.STRING, allowNull:'false'},
        amount:{type: DataTypes.FLOAT, allowNull:'false'},
        userid:{type:DataTypes.INTEGER, allowNull:"false"}

    })
}