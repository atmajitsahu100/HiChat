

// model required
const User = require("../models/UserModel")

// dependency required

exports.getUserProfileById = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "user not found" 
      });
    }
    res.json({ 
      success: true, 
      user 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: "something went wrong while fetching user profile detail" 
    });
  }
};

exports.updateUserProfileById = async (req, res, next) => {
  const {
    userId,
    firstName,
    lastName,
    gender,
    contactNo,
  } = req.body;

  const updatedData = {
    firstName,
    lastName,
    gender,
    contactNo,
  };

  

  try {
    const user = await User.findByIdAndUpdate(userId, updatedData,
      {new: true,}
    );

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "user not found" 
      });
    }

    res.json({ 
      success: true, 
      user, 
      message: "profile updated successfully" 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: "something went wrong whileupdating user profile detail"
    });
  }
};



