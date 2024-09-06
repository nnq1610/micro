module.exports = (mongoClient, options) => {
  //ob làm định dạng mặc đingj cho Id trong các tài liệu. KHi bạn mốt liên kết 1 tài liệu với 1 tài liệu khác, ví dụ owner và categories, các giá trị này cần được chuyển đổi thành kiểu ObjectIs để phù họp với kiẻu dữ liệu trong MongoDb


  const {ObjectId} = options;
  function createIndex (){
    mongoClient.createCollection('posts', (err) => {
      if (err) {
        return console.log(err);
      }
      mongoClient.collection('posts').createIndex('name',{unique: true})
    })
  }
  createIndex()

  const addPost = (post) => {
    let {categories, owner} = post
    categories = categories.map((i) => new ObjectId(i))
    owner = new ObjectId(owner)

    return new Promise((resolve, reject) => {
      post = {...post, categories, owner}
      mongoClient.collection('posts').insertOne(post, (err, data) => {
        err ? reject(new Error(err)) : resolve(data)
      })

    })
  }

  const removePost = (id) => {
    return new Promise((resolve, reject) => {
      mongoClient.collection('posts').remove({ _id: new ObjectId(id) }, (err, data) => {
        err ? reject(new Error(err)) : resolve(data)
      })
    })
  }
  const getPostById = (id) => {
    return new Promise((resolve, reject) => {
      mongoClient.collection('posts').findOne({ _id: id }, (err, data) => {
        err ? reject(new Error(err)) : resolve(data)
      })
    })
  }

  const getPostByIdUser = (uid) => {
    return new Promise((resolve, reject) => {
      mongoClient.collection('posts').find({
        'categories': { $elemMatch: { $eq: new ObjectId(uid) } }
      }).toArray((err, data) => {
        if (err) {
          return reject(err); // Truyền lỗi trực tiếp
        }
        resolve(data); // Trả về kết quả sau khi đã chuyển thành mảng
      });
    });
  }

  const getPostByIdCategory = (id) => {
    return new Promise((resolve, reject) => {
      mongoClient.collection('posts').find({ 'categories': { $elemMatch: { $eq: new ObjectId(id) } } }).toArray((err,data) => {
        err ? reject(new Error(err)) : resolve(data)
      })
    })
  }
  const deletePost = (id) => {
    return new Promise((resolve, reject) => {
      mongoClient.collection('posts').deleteOne({ _id: new ObjectId(id) }, (err, data) => {
        err ? reject(new Error(err)) : resolve(data)
      })
    })
  }
  return { addPost, removePost, getPostById, getPostByIdUser, getPostByIdCategory, deletePost }
}