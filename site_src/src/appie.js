/*$(document).ready( function() {
    var ob = a.route();
    for ( var key in ob ) 
    {
        console.log( ob[key] );
    }
});*/


Appie = function( url ) {
    $( document ).ready( this.retrieve( url ) );
}

Appie.prototype = {
    
    retrieve : function( url ) {
        url = url || "all.json";
        jQuery.getJSON("all.json", function(data) {
            this.ALL = data;
            var location = window.location.href.split('#')[1] || "";
            var ob = this.route();
            var appieEvent = new CustomEvent( 'appie_routed', { detail: ob } );
            document.dispatchEvent( appieEvent );
            //for ( var key in ob ) 
            //{
            //    console.log( key, ob[key] );
            //}
        }.bind( this ) )
        .error(function(e) {
            console.log("Appie error retrieve " + url, e );
        });
    },
    
    get_data_from_path : function( path ) {
        var path = path.split('/');
        var ob = this.ALL;
        for ( var i=0; i<path.length;i++ ) {
            ob = ob[ path[i] ];
            if ( ob === undefined ) {
                console.warn( "Appie get_data_from_path: no data found", i, path );
                return null;
            }
        }
        return ob;
    },
    
    // return the relevant JSON data based on location
    route :  function( ) {
        var location = window.location.href.split('#')[1] || "";
        var path = location.split('?')[0];
        var ob = this.get_data_from_path( path );

        console.log("Appie route location: "+path);
        // update address bar
        //history.pushState({}, "location_path", location_path);
        return ob;
    },
    
    find_imgs_in_obj : function (obj) 
    {       
        var imgs = [];
        for (var key in obj)
        {
            //console.log( key, this.is_image( obj[key] ) );
            if ( this.is_image( obj[key] ) ) {
                imgs.push( obj[key] );
            }
            else if (typeof(obj[key]) === 'object') 
            {
                //recurse
                imgs = imgs.concat( this.find_imgs_in_obj( obj[key] ) );
            }
        }
        return imgs;
    },
        
    is_image : function( obj ) 
    {
        return obj.mimetype && obj.mimetype.includes("image");
    },
    
    date_format : function(date) 
    {
        var monthNames = [
          "January", "February", "March",
          "April", "May", "June", "July",
          "August", "September", "October",
          "November", "December"
        ];
        var year = date.substring(0,4);
        var month = monthNames[parseInt(date.substring(5,6))];
        var day = date.substring(7,8);
        return ""+day+' '+month+' '+year;
    },
    
    keys_in : function(keys, ob)
    // Returns false if a key is not in the object otherwise returns
    // true
    {
        if (!(typeof(ob) === 'object')) return false;
        for (var i=0; i < keys.length; i++)
        {
            if (!(keys[i] in ob)) return false;
        }
        return true;
    },
    
    sort_object : function(data, sortkey, reversed) 
    {
        // returns an array of the keys sorted by sortkey
        // Prep
        sortkey = sortkey || "_date"; 
        var dataSorted = {};
        var tmp = []; // filled with sortkey
        var tmp2 = {}; // filled with obj, key=sortkey so we can find it
        var tmp3 = {}; // filled with key, key==sortkey so we can find it
        // Populate array with sortkey values
        for (var key in data) {
            if ( typeof data[key] === 'object' ) {
                try { 
                    tmp.push(data[key][sortkey].content); 
                    tmp2[data[key][sortkey].content] = data[key];
                    tmp3[data[key][sortkey].content] = key;
                } catch(e) { console.warn(" > data[key][sortkey].content undefined: "+key+", "+sortkey); }
            }
        }
        // Sort
        tmp.sort();
        if (reversed) { tmp.reverse(); }
        // Build new data
        for (var i=0; i<tmp.length; i++) {
            var tmpkey = tmp[i];
            var datakey = tmp3[tmpkey];
            dataSorted[datakey] = tmp2[tmpkey];
        }
        return dataSorted;
    }
}

