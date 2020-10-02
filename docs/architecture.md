# Architecture

## Node.js 3 Layer Architecture

`Controller Layer <--> Service Layer <--> Data Access Layer`

### Controller Layer

- Page routing

### Service Layer

- Business Logic
- Performing functions, calling DAOs and reporting to controllers

### Data Access Layer

- Direct database interaction
- DAO Classes defined here

## Pages and Features
    +-------------------------------+
    | Relies mainly on Main DB      |
    +-------------------------------+
    |- Dashboard "root/user/dashboard"
    |  |- Calendar
    |  |  |- Show current date
    |  |  |- Events Today and Details (formality, time, etc)
    |  |- Weather
    |  |  |- Shows Temp/feels like, Precip, Wind
    |  |  |- Configurable Location by zip
    |  |- Outfit
    |  |  |- Show 3 Generated Outfits
    |  |  |- Generate new set button
    |  |  |- Save as preset button (tbd: requires outfit entity)
    |  |  |- Article Lock Button
    |  |  |  |- Make article unaffected by regeneration
    |  |  |- Flag as dirty (overlap feature in Closet/Select)
    |  |- Navigation & Other functions
    |  |  |- Go to Closet
    |  |  |- Go to Account/Settings
    |  |  |- Indicate Laundry Day
    |  |  |
    |- Closet Page "root/user/closetname"
    |  |- Filter/sort by season, type, color, rating, etc.
    |  |- Select single or multiple item(s)
    |  |  |- Delete button
    |  |  |- Flag as dirty (overlaps feature in Dashboard/Outfit)
    |  |  |- Cancel button
    |  |- New Article "../newarticle"
    |  |  |- Form for Article name, tags, properties, rating, etc.
    |  |- Article Detail Page "../articlecode"
    |  |  |- View Article tags, name, props, rating, etc.
    |  |  |- Edit Article "../edit"
    |  |  |  |- Form to edit tags, name, properties, rating, etc
    |  |  |  |- Save Changes button
    |  |  |  |- Cancel button
    |  |  |  |
    +-------------------------------+
    | Relies mainly on Auxiliary DB |
    +-------------------------------+
    |- Account/Settings Page "root/user/settings"
    |  |- User Account "../account"
    |  |  |- Edit name, password, email etc.
    |  |- Application settings "../application"
    |  |  |- Edit calendar & weather setup
    |  |  |
    +-- Requires Password Hashing --+
    |- Login Page "root/login"
    |  |- Enter username/password
    |  |- etc.
    |- Signup page "root/signup"
    |  |- etc.
    |  |
    
## Database Entities

### User

Fields
- UserID
- Name
- Email
- Password
- calendar credentials
- Saved Zip code

### Closet

Fields
- Owner(UserID)
- ClosetID
- Name

### Article

Fields
- ClosetID
- ArticleID
- Name
- Desc.
- Image
- Type (Top, bottom, Singlet, optional Singlet)
- Properties
  - Color
  - Season
  - Rating(ordinal)
  - Formal(binary)

### Metadata

Written for each interaction with articles while choosing

Fields
- ArticleID
- MetadataID
- Date
- Day of week
- Weather
  - Temp, precip, wind
- Accepted Article (bool)
