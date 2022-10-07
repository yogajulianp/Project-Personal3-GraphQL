module.exports = (sequelize, Sequelize) => {
  const Comment = sequelize.define("commentBerita2", {
    // id: {
    //     type: DataTypes.INTEGER,
    //     autoIncrement: true,
    //     primaryKey: true
    // },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    comment: {
      type: Sequelize.TEXT,
      allowNull: false
    },

    // created: {
    //     type: Sequelize.DATE
    // },
  });
  return Comment;
};
