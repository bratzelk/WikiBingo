
/**
 * GET /game
 */
exports.getGame = (req, res) => {
  console.log('Showing game');
  res.render('game', {
    title: 'Game'
  });
};



