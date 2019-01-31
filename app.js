//import modules
const Inquirer = require("inquirer");
const connection = require("./config/connection.js");

connection.connect(err => {
    if (err) throw err;
    console.log("connected with id " + connection.threadId);

    //run app
    main();
});



//helper functions
function main() {
    
    //get products choices from db
    const productChoices = [];
    const query = connection.query("SELECT * FROM bamazon", (err, results) => {
        if (err) throw err;

        results.forEach(element => {
            productChoices.push({
                name: element.id + ": " + element.product_name + " $" + element.price.toFixed(2),
                value: element.id
            });
        });
        purchasePrompt(productChoices);
    });
}

function purchasePrompt(productChoices) {

    //get user input
    Inquirer.prompt([
        {
        name: "productId", 
        type: "list",
        pageSize: productChoices.length,
        message: "Which proudct would you like to buy?",
        choices: productChoices
        },
        {
            name: "quantity",
            type: "input",
            message: "How many would you like to buy?"
        }
    ]).then(choices => {
        
        //get product by selected id
        connection.query("SELECT * FROM bamazon WHERE ?", {id: choices.productId}, (err, results) => {
            if (err) {
                console.log("An error has ocurred: product not found");
                purchasePrompt(productChoices);
            }

            //in stock - go through with purchase
            const quantity = parseInt(choices.quantity);
            if (results[0].stock >= quantity) {

                //update stock
                connection.query("UPDATE bamazon SET ? WHERE ?", 
                    [{stock: results[0].stock - quantity}, {id: results[0].id}], (updateErr, updateResults) => {
                    
                    //handle purchase results
                    if (updateErr) {
                        console.log("An error has ocurred: purchase could not go through", updateErr);
                    } else {   
                        console.log("Purchase complete! Total cost: $" + (results[0].price * quantity).toFixed(2));
                    }

                    //prompt for next action
                     purchasePrompt(productChoices);
                });

            } else {
                
                //prompt for next action
                console.log("Insufficent stock to complete order.");
                purchasePrompt(productChoices);
            }
        })
    });
}