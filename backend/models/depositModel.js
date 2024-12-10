module.exports = (sequelize,DataTypes)=>{
    return sequelize.define('deposit',{
        image:{type:DataTypes.STRING, allowNull:false},
        amount:{type:DataTypes.STRING, allowNull:false},
        transid:{type:DataTypes.STRING},
        status:{type:DataTypes.STRING, allowNull:false,defaultValue:'pending'}
    })
}