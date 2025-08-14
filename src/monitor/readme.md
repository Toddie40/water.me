# Monitor

This app runs as a daemon in the background routinely monitoring the state of the plant waterer and automatically issuing commands to water the plants if neccessary and also updating the database with up-to-date information on the status of the plants. 


The database acts as the single point of truth for the application but this little app serves as a way to keep that database up to date so the frontend doesn't have to issue a load of get requests to the api when it loads initially. 

Hopefully this should mean information flows through the database when 'reading' from the plant waterer, but flow directly to the waterer when issuing 'commands'.

