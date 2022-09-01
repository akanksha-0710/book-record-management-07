const express = require("express");
const {books} =  require("../data/books.json");
const {users} = require("../data/users.json");

const router = express.Router();


/**
 * Route:/books
 * Method: GET
 * Description:Getting all books
 * Access: Public
 * Parameters: None 
 */

router.get('/',(req,res)=>{
    res.status(200).json({
        success:true,
        data:books
    });
});

/**
 * Route:/books/:id
 * Method: GET
 * Description:Getting book by id
 * Access: Public
 * Parameters: id 
 */

router.get('/:id',(req,res)=>{
    const{id} =req.params;
    const book = books.find((each)=>each.id ===id); 
    if(!book)
    return res.status(404).json({
        success:false,
        message:"Book not found",
    }); 
    return res.status(200).json({
        success:true,
        data:book,
    });   
});

/**
 * Route:/books/issued/by-user 
 * Method: GET
 * Description:Get all issued books
 * Access: Public
 * Parameters: none
 */

router.get('/issued/by-user',(req,res)=>{
    const usersWithIssuedBooks = users.filter((each)=>{
         if(each.issuedBook) return each; 
    });

    console.log(users);

    const issuedBooks =[];
    usersWithIssuedBooks.forEach((each)=>{
        const book = books.find((book)=>book.id ===each.issuedBook);
        
        book.issuedby = each.name;
        book.issuedDAte = each.issuedDate;
        book.returnDate = each.returnDate;

        issuedBooks.push(book);
    });

    if(issuedBooks.length ===0)
    return res.status(404).json({
        success: false,
        message:"No books issued yet",
    
    });

    return res.status(200).json({
        success: true,
        data:issuedBooks,
    });
});

/**
 * Route:/books
 * Method: POST
 * Description:Create new book
 * Access: Public
 * Parameters: none
 * Data: author,name,genre,price,publisher,id
 */

router.post('/',(req,res)=>{
    const{data} = req.body;

    if(!data){
        return res.status(400).json({
            success:false,
            message:"No data provided",
        
        });

    }

 const book = books.find((each)=> each.id ===data.id);
  
 if(book){
    return res.status(404).json({
        success:false,
        message:"Book already exist with this id,plz use a unique id",
    });
 }

    
    
    const allBooks = [...books,data];

    return res.status(201).json({
        success: true,
        data: allBooks,
    });
});

/**
 * Route: /books/:id
 * Method: PUT
 * Description: Update book
 * Access: Public
 * Parameters: id
 * Data: author, name, genre, price, publisher, id
 */
 router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { data } = req.body;
  
    const book = books.find((each) => each.id === id);
  
    if (!book) {
      return res.status(400).json({
        success: false,
        message: "Book not found with this particular id",
      });
    }
  
    const updateData = books.map((each) => {
      if (each.id === id) {
        return { ...each, ...data };
      }
      return each;
    });
  
    return res.status(200).json({
      success: true,
      data: updateData,
    });
  });


/**
 * Route: /books/issued/withFine
 * Method: GET
 * Description: Get a fine 
 * Access: Public
 * Parameters: none
*/

router.get("/issued/with-fine", (req, res) => {
    const usersWithIssuedBooksWithFine = users.filter((each) => {
        if (each.issuedBook) return each;
    });

    const issuedBooksWithFine = [];

    usersWithIssuedBooksWithFine.forEach((each) => {
        const book = books.find((book) => book.id === each.issuedBook);

        book.issuedBy = each.name;
        book.issuedDate = each.issuedDate;
        book.returnDate = each.returnDate;


        const getDateInDays = (data = "") => {
            let date;
            if (data === "") {
                date = new Date();
            } else {
                date = new Date(data);
            }
            let days = Math.floor(date / (1000 * 60 * 60 * 24)); //1000 is for milliseconds
            return days;
        };

        let returnDate = getDateInDays(each.returnDate);

        let currentDate = getDateInDays();

        if (returnDate < currentDate) {
            issuedBooksWithFine.push(book);
        }
    });

    if (issuedBooksWithFine.length === 0) {
        return res.status(404).json({
            Success: false,
            Message: "No books which have fine",
        });
    }

    return res.status(200).json({
        Success: true,
        Message: "Issued Books List which have fine",
        Data: issuedBooksWithFine,
    })
});



//default exports
module.exports = router;

