// Storage Controller
const StorageCtrl = (function() {
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCLE6QWUmvltRQ86hjBHfOKMDYobTDx7e8",
    authDomain: "product-management-71225.firebaseapp.com",
    databaseURL: "https://product-management-71225.firebaseio.com",
    projectId: "product-management-71225",
    storageBucket: "product-management-71225.appspot.com",
    messagingSenderId: "972362764328",
    appId: "1:972362764328:web:c0d81b320546701967e51d"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
})();

// Item Controller
const ItemCtrl = (function() {
  // PUBLIC methods
  return {
    getItems: function() {
      let promise = new Promise(async (resolve, reject) => {
        let values = await firebase.firestore().collection("items").get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              // doc.data() is never undefined for query doc snapshots
              //console.log(doc.data().input);
              const input = doc.data().input;
              //console.log(doc);
              const li = document.createElement("li");
              //add class
              li.className = "list-group-item";
              // Add id
              li.id = `${doc._key.path.segments[6]}`;
              // add html
              li.innerHTML = `<img
                              src="${input.productImg}"
                              alt=""
                              srcset=""
                              style="width: 100px;height: 100px;padding-right: 10px; margin:10px"
                            />
                            <strong
                              id="item-list-name"
                              style="float: left;margin: 22px;"
                              >${input.productname}</strong
                            >
                            <em id="desp" style="float: left;margin:22px">${input.productDesp}</em>
                            <span class="badge badge-success badge-pill">Rs.${input.productprice}</span>
                            <span class="badge badge-info badge-pill">Quantity:${input.productQant}</span>
                            <span
                              class="badge badge-primary badge-pill"
                              style="float: right; margin: 8%;"
                            >
                              <i class="delete-item fa fa-trash" aria-hidden="true" style="font-size=30px"></i
                            ></span>`;
                // insert item
                document
                .querySelector(".list-group")
                .insertAdjacentElement("beforeend", li);
          });
        })
      });
    }
  };
})();

// UI controller

const UICtrl = (function() {
  const UISelectors = {
    itemName: "#product-name",
    itemPrice: "#product-cost",
    itemDesp: "#product-description",
    itemImg: "#product-image",
    addBtn: "#additembtn",
    updateBtn: "#updateitembtn",
    deleteBtn: "#deleteitembtn",
    backBtn: "#backbtn",
    itemList: ".list-group",
    ListItem: ".list-group li",
    editBtn: "#edititemBtn",
    itemQuant: "#product-quant"
  };
  var imageB64;

  return {
    setImgaeBase64: function(image) {
      imageB64 = image;
    },
    getSelectors: function() {
      return UISelectors;
    },
    populateItemList: function(items) {
      if (items && items.length > 0)
        for (var i = 0; i < items.length; i++) {
          UICtrl.addListItem(items[i]);
        }
    },
    clearInput: function() {
      //Clear Input Fields
      document.querySelector(UISelectors.itemName).value = "";
      document.querySelector(UISelectors.itemQuant).value = "";
      document.querySelector(UISelectors.itemDesp).value = "";
      document.querySelector(UISelectors.itemPrice).value = "";
      document.querySelector(UISelectors.itemImg).value = "";
    },
    readProductDetails: function() {
      return {
        productname: document.querySelector(UISelectors.itemName).value,
        productprice: document.querySelector(UISelectors.itemPrice).value,
        productDesp: document.querySelector(UISelectors.itemDesp).value,
        productImg: imageB64,
        productQant: document.querySelector(UISelectors.itemQuant).value
      };
    }
  };
})();

// app main

const app = (function(ItemCtrl, UICtrl) {
  const loadEventListeners = function() {
    const UISelectors = UICtrl.getSelectors();

    // add item Submint
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);

    // Delete item event
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", itemDeleteSubmit);

    //image item event
    document
      .querySelector(UISelectors.itemImg)
      .addEventListener("change", readURL);

    //console.log("Loading Events...");
  };

  // Generates thebase64
  function readURL() {
    //console.log("Reader");
    let input = document.querySelector("#product-image");
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.addEventListener(
        "load",
        function() {
          var src = reader.result;
          UICtrl.setImgaeBase64(src);
          // console.log(UICtrl.imageB64);
        },
        false
      );

      reader.readAsDataURL(input.files[0]);
    }
  }

  // ADD ITEM SUBMIT
  const itemAddSubmit = function(e) {
    const input = UICtrl.readProductDetails();
    // validate and add
    if (
      input.productname !== "" &&
      input.productDesp !== "" &&
      input.productprice !== "" &&
      input.productImg !== "" &&
      input.productQant !== ""
    ) {
      //ADD ITEM TO UI LIST
            // Firebase Storing
      firebase.firestore().collection("items").add({
        input
      }).then(() => {
        alert("Thank You!");
        location.reload();
      }); 
      // clear input fields
      UICtrl.clearInput();
    } else {
      alert("Please enter Items Details");
    }

    e.preventDefault();
  };

  // Delete item MEthod
  const itemDeleteSubmit = function(e) {
    // Get Current Item
    const listId = e.target.parentNode.parentNode.id;
    //console.log(listId);

    firebase.firestore().collection("items").doc(listId).delete().then(function() {
      location.reload();
    })

    e.preventDefault();
  };

  return {
    init: async function() {
      loadEventListeners();
      UICtrl.populateItemList(ItemCtrl.getItems());
    }
  };
})(ItemCtrl, UICtrl);

app.init();
