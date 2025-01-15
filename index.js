const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const multer = require("multer");
const path = require("path");
const Post = require("./models/post");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

mongoose
  .connect(
    "mongodb uri",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const userSchema = new mongoose.Schema({
  fullName: String,
  phoneNumber: String,
  username: String,
  email: String,
  password: String,
});
const User = mongoose.model("User", userSchema);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "secrete key",
    resave: false,
    saveUninitialized: true,
  }),
);

app.get("/", async (req, res) => {
  const user = req.session.user;
  if (!user) {
    return res.sendFile(path.join(__dirname, "public", "index.html"));
  }

  try {
    const userData = await User.findById(user.userId);
    res.render("index", { user, posts: userData.posts });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving posts");
  }
});

// Middleware to check if user is logged in for protected routes
const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
};

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login-signup.html"));
});

app.get("/editor", requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "editor.html"));
});

app.post("/signup", async (req, res) => {
  try {
    const { fullName, phoneNumber, username, email, password } = req.body;

    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).send("Username or email already exists");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // Hash with 10 salt rounds

    const newUser = new User({
      fullName,
      phoneNumber,
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    // Store user information in session
    req.session.user = {
      userId: newUser._id,
      username: newUser.username,
      email: newUser.email,
      name: newUser.fullName,
    };

    res.redirect("/editor");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error logging in");
  }
});

app.post("/verify", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("Email not found");
    }
    res.status(200).send("Email found");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error verifying email");
  }
});

app.post("/changepass", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("User not found");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).send("Password changed successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error changing password");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send("Invalid username or password");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).send("Invalid username or password");
    }

    req.session.user = {
      userId: user._id,
      username: user.username,
      email: user.email,
      name: user.fullName,
    };

    res.redirect("/profile");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error logging in");
  }
});

app.post("/createPost", upload.single("image"), async (req, res) => {
  const { title, content } = req.body;
  const imagePath = req.file ? "/uploads/" + req.file.filename : null;
  const user = req.session.user;
  if (!user) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const post = new Post({
      title,
      content,
      imagePath,
      name: user.username,
      user: user.userId,
      createdAt: new Date(),
    });

    // Save the post to the database
    await post.save();

    // Redirect to home page on successful post creation
    res.redirect("/");
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/posts", async (req, res) => {
  try {
    // Find all posts and sort them by createdAt date in ascending order
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.get("/display/:postId", async (req, res) => {
  const postId = req.params.postId;
  try {
    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route for logging out
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).send("Error logging out");
    }
    res.redirect("/");
  });
});

app.use((req, res, next) => {
  if (req.url.endsWith(".css")) {
    res.setHeader("Content-Type", "text/css");
  }
  next();
});

app.get("/profile", requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "profile.html"));
});

app.get("/profile/userdata", requireLogin, async (req, res) => {
  const user = req.session.user;
  try {
    const userData = await User.findById(user.userId);
    //   console.log(userData);
    res.json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving user data" });
  }
});

app.get("/profile/post", async (req, res) => {
  const user = req.session.user;
  try {
    const posts = await Post.find({ user: user.userId });
    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.get("/profile/logout", async (req, res) => {
  // Clear session
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      res.status(500).json({ error: "Error logging out" });
    } else {
      // Redirect to landing page
      res.redirect("/");
    }
  });
});

// Add this route for handling search requests
app.get("/search", async (req, res) => {
  const searchQuery = req.query.query.trim();

  if (!searchQuery) {
    return res.status(400).send("Search query cannot be empty");
  }

  try {
    // Search for posts containing the search query in the title or name
    const posts = await Post.find({
      $or: [
        { title: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search in post titles
        { name: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search in post authors' names
      ],
    });

    res.json(posts);
  } catch (error) {
    console.error("Error searching posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/profile/post/:postId", async (req, res) => {
  const postId = req.params.postId;
  try {
    // Find the post by ID
    const post = await Post.findById(postId);

    // Check if the post exists
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the post has an image
    if (post.imagePath) {
      // Check if the image file exists
      const imagePath = __dirname + "/public" + post.imagePath;
      if (fs.existsSync(imagePath)) {
        // If the image file exists, delete it
        fs.unlinkSync(imagePath);
      }
    }

    // Delete the post
    await post.deleteOne({ _id: postId });

    // If the post is successfully deleted, return a success response
    res.json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    // If an error occurs during the deletion process, return a 500 Internal Server Error response
    console.error("Error deleting post:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
