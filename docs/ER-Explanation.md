We have 5 total entities in our ER model: User, Past and Current Conditions, Biometrics, Diagnosis, and Lifestyle. 

User is the only strong entity in the dataset, with everything else being a weak entity dependent on User. The entities are separate from each other based on their domains and categories. 

For example, User stores a user’s ID as its primary key (listed as PatientId in the ER, but essentially any distinguishing ID will suffice), age, gender, and country make up a user’s “personal” profile. 

The Diagnosis entity is made of risk and diagnosis attributes for the user; this is in a 1-1 relationship with user because we expect each user to have only one diagnosis at a time. ID acts as a foreign key from Diagnosis to User. There is no use in having records of past diagnostics. 

The Conditions entity is made up of mainly boolean valued attributes that signify whether the user has certain conditions or not. Lifestyle also mainly contains boolean attributes that detail whether a user has certain lifestyle choices. The Biometrics entity tracks biometric values for a user (BMI, blood glucose levels, etc) that take positive float values. Each of these entities is in a 1-M relationship with User because we expect each user to have multiple Biometrics, Lifestyle, and Conditions records that they update over time. Having multiple records for each user should add predictive value to the application.



