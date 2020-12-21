const msg = {
  data: {
    photo: 'data:image/gif;base64,SGVsbG8gV29ybGQ='
  }
};

let photo;

// if(msg.data.photo.toLowerCase().indexOf('data:image') === 0) {
  try {
    // eslint-disable-next-line no-unused-vars
    const basePart = msg.data.photo.replace(/data:image\/[^;]+;[^,]+,/gui,'');
    console.log(basePart);
    const decoded = Buffer.from(basePart, 'base64').toString('ascii');

    console.log('D',test);
    const recoded = ( new Buffer.from(decoded) ).toString("base64")

    console.log('R',recoded);

    if(basePart === recoded) {
      console.log('Equal!');
      photo = msg.data.photo;
    }

  } catch (e) {
    console.log(e);
    console.log('Photo is not base64 image discarding');
  }
// }

console.log(photo);
