exports.up = (pgm) => {
  pgm.addColumn("users", {
    features: {
      type: "varchar[]",
      notNull: true,
      default: "{}",
    },
  });
};

exports.down = false;

//eu rodei essa migration em localhost, mas não sei se ela vai interferir para a próxima aula, já que os testes estão falhando
