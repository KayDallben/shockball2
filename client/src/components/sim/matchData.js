export default class MatchData {
  constructor() {
    this.homeTeam = {
      teamVenueName: 'Abregado Galactic Stadium',
      teamName: 'Abregado Gentlemen',
      players: [
        {
          uid: 1,
          firstName: 'Tholme',
          lastName: 'So',
          picUrl: '//i736.photobucket.com/albums/xx4/bpkennedy/norringtonfreelance.jpg',
          teamUid: '-KnCepjY8BLF_0bcANzF',
          teamName: 'Abregado Gentlemen',
          teamPicUrl: 'http://www.brandcrowd.com/gallery/brands/thumbs/thumb14751184306802.jpg',
          passing: 15,
          toughness: 36,
          throwing: 20
        }
      ]
    }
    this.awayTeam = {
      teamName: 'Kashyyyk Rangers',
      players: [
        {
          uid: 2,
          firstName: 'Yan',
          lastName: 'Yansen',
          picUrl: '//tresario.com/forum/index.php?action=dlattach;attach=271;type=avatar',
          teamUid: '-KnGp3lbMpZVvl1bGGvy',
          teamName: 'Kashyyyk Rangers',
          teamPicUrl: 'https://vignette1.wikia.nocookie.net/limmierpg/images/4/42/Rangers.jpg/revision/latest?cb=20140503184850',
          passing: 15,
          toughness: 36,
          throwing: 20
        }
      ]
    }
  }

  //TODO: here is where we query the database for the team and player data for this match simulation - stubbing the data in the constructor above for now...
}