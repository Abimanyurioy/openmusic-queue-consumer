const { Pool } = require("pg");

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async getSongs(playlistId) {
    const query = {
      text: `
      SELECT
        p.id as playlistid,
        p.name,
        s.id AS songid,
        s.title,
        s.performer
      FROM
          playlistsongs ps
      INNER JOIN playlists p ON p.id = ps.playlist_id
      LEFT JOIN songs s ON s.id = ps.song_id
      WHERE ps.playlist_id = $1
    `,
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    return {
      playlist: {
        id: result.rows[0].playlistid,
        name: result.rows[0].name,
        songs: result.rows.map((row) => ({
          id: row.songid,
          title: row.title,
          performer: row.performer,
        })),
      },
    };
  }
}

module.exports = SongsService;
