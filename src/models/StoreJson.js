import fs from 'mz/fs';
import errors from '../lib/errors';

const STORAGE_DIRNAME = 'data';

function partsFromFilename(fname) {
  const body = fname.slice(0, -5);
  return body.split('__');
}

class StoreJson {
  index() {
    return Promise.resolve()
      .then(() => fs.readdir(STORAGE_DIRNAME))
      .then((files) => files.filter((f) => f.match(/.*\.json$/)))
      .then((jsons) => jsons.map(partsFromFilename))
      .then((parts) => parts.map((p) => `${p[0]}/${p[1]}/${p[2]}`));
  }

  save(url, data) {
    const parts = url.split('/');

    return fs.writeFile(`${STORAGE_DIRNAME}/${parts[0]}__${parts[1]}__${parts[2]}.json`, JSON.stringify(data));
  }

  _extractCoordsFromUrl(str) {
    const arr = str.trim().split('@');
    if (arr.length === 2) {
      return arr[1].split(',', 2);
    }

    return false;
  }

  _parseEvents(data) {
    const res = data
      .filter((row) => row.aprobado === 'TRUE')
      .map((row) => {
        const ret = {
          id: row.id,
          location: row.donde,
          description: row.descripcion,
          date: row.fecha,
        };

        ret.historia = row.historia !== 'N/A' ? row.historia : '';
        // ret.categories = row.categorias !== 'N/A' ? row.categorias.filter((c) => c !== 'N/A') : [];
        // ret.category = row.categorias.find((cat) => cat !== 'N/A');
        ret.category = row.categoria;
        ret.videos = row.videos;
        ret.imgs = row.imgs;
        ret.fuente = row.fuente;
        ret.nombre_victima = row.nombre_victima;
        ret.ubicacion = row.ubicacion;
        ret.filters = row.subcategorias;

        if (row.geo.length) {
          const coords = this._extractCoordsFromUrl(row.geo);
          ret.latitude = coords[0];
          ret.longitude = coords[1];
        }

        return ret;
      });
    return res;
  }

  _parseCategories(data) {
    const ret = {};
    // const cais = data.find((column) => column.name === 'cai').items;
    // const geoCais = data.find((column) => column.name === 'geo_cai').items;
    const categories = data.find((column) => column.name === 'categoria').items;

    // ret.cais = cais.map((name, i) => {
    //   if (geoCais[i]) {
    //     const coords = this._extractCoordsFromUrl(geoCais[i]);

    //     return {
    //       name: name,
    //       latitude: coords[0],
    //       longitude: coords[1],
    //     };
    //   } else {
    //     return { name: name };
    //   }
    // });

    ret.categories = categories.filter((cat) => cat.length > 0 && cat !== 'N/A');
    // // ret.category = category;

    return ret;
  }

  _parseVictimas(data) {
    return data.map((row) => {
      const coords = this._extractCoordsFromUrl(row.geo);
      if (coords) {
        row.latitude = coords[0];
        row.longitude = coords[1];
      }

      delete row.geo;

      return row;
    });
  }

  _parseCais(data) {
    return data
      .filter((r) => r.geo.length)
      .map((cai) => {
        const ret = {};
        const coords = this._extractCoordsFromUrl(cai.geo);

        if (coords) {
          ret.latitude = coords[0];
          ret.longitude = coords[1];
        }

        cai.name = cai.nombre.trim();

        delete cai.geo;
        delete cai.nombre;

        return { ...ret, ...cai };
      });
  }

  parse(data, sheet) {
    if (sheet === 'cais') return this._parseCais(data);
    if (sheet === 'eventos') return this._parseEvents(data);
    if (sheet === 'menus') return this._parseCategories(data);
    if (sheet === 'victimas') return this._parseVictimas(data);
    if (sheet === 'nueve_s') return this._parseEvents(data);

    return data;
  }

  load(url) {
    const parts = url.split('/');
    const fname = `${STORAGE_DIRNAME}/${parts[0]}__${parts[1]}__${parts[2]}.json`;
    if (fs.existsSync(fname)) {
      return fs
        .readFile(fname, 'utf8')
        .then((data) => JSON.parse(data))
        .then((data) => {
          data = this.parse(data, parts[1]);

          if (parts.length === 3) {
            // No lookup if the requested url doesn't have a fragment
            return data;
          } else if (parts[2] === 'ids') {
            // Do a lookup if fragment is included to filter a relevant item
            // When the resource requested is 'ids'
            const id = parseInt(parts[3]);
            if (!isNaN(id) && id >= 0 && id < data.length) {
              return data[id];
            } else {
              throw errors.noFragment(parts);
            }
          } else {
            // Do a lookup if fragment is included to filter a relevant item
            const index = parseInt(parts[3]);
            if (!isNaN(index) && index >= 0 && index < data.length) {
              return data.filter((vl, idx) => idx === index)[0];
            } else {
              throw errors.noFragment(parts);
            }
          }
        });
    } else {
      return Promise.reject(errors.noResource(parts));
    }
  }

  // TODO: add method to build blueprint from data sheet
}

export default StoreJson;
