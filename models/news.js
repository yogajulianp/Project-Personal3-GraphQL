module.exports = (sequelize, Sequelize) => {
  const News = sequelize.define("newsBerita2", {
    // id: {
    //     type: DataTypes.INTEGER,
    //     autoIncrement: true,
    //     primaryKey: true
    // },
    title: {
      type: Sequelize.TEXT,
    },
    image: {
      type: Sequelize.STRING,
    },
    berita: {
      type: Sequelize.TEXT,
    },
  },{
    paranoid: true,
    // If you want to give a custom name to the deletedAt column
    deletedAt: 'destroyTime',
  });
  return News;
};
