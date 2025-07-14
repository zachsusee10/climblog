package com.zach.climblog.utils;

public class Utils {
    
    //this class is the definition of a hack... don't even know how to do this without hardcoding im a noob
    public static double calcGrade(String grade, String type)
    {
        System.out.println(grade);
        switch (type) {
            case "Boulder":
            System.out.println("entering");
                return calculateBoulder(grade);
            case "Top Rope":
                return calculateSport(grade);
            case "Sport":
                return calculateSport(grade);
            case "Trad":
                return calculateSport(grade);
            case "Solo":
                return calculateSport(grade);
            default:
                //throw exception(e); add exception support if someone somehow sneaks a bad type in
                return 0;
        }
        
    }

    public static double calculateBoulder(String grade)
    {

        double increment = 10.0/17;
        System.out.println("here");

        //is there a better way to do this than a switch? maybe a way to map to ints? not sure, but should look into this
        switch (grade) {
            case "V0":
                return 0;
            case "V1":
                return increment;
            case "V2":
                return 2 * increment;
            case "V3":
                return 3 * increment;
            case "V4":
                return 4 * increment;
            case "V5":
                return 5 * increment;
            case "V6":
                return 6 * increment;   
            case "V7":
                return 7 * increment;
            case "V8":
                return 8 * increment;
            case "V9":
                return 9 * increment;
            case "V10":
                return 10 * increment;
            case "V11":
                return 11 * increment;
            case "V12":
                return 12 * increment;
            case "V13":
                return 13 * increment;
            case "V14":
                return 14 * increment;
            case "V15":
                return 15 * increment;
            case "V16":
                return 16 * increment;
            case "V17":
                return 17 * increment;
            default:
            //add error handling here too
                return 0;
        }
    }


    //rght now we will only support YDS, could support french + british later if i make this public
    public static double calculateSport(String grade)
    {
        double increment = 10.0/24;
        //hardcoding is probably bad... too bad!
        switch (grade) {
            case "5.10a":
                return increment;
            case "5.10b":
                return 2*increment;
            case "5.10c":
                return 3*increment;
            case "5.10d":
                return 4*increment;
            case "5.11a":
                return 5*increment;
            case "5.11b":
                return 6*increment;
            case "5.11c":
                return 7*increment;
            case "5.11d":
                return 8*increment;
            case "5.12a":
                return 9*increment;
            case "5.12b":
                return 10*increment;
            case "5.12c":
                return 11*increment;
            case "5.12d":
                return 12*increment;
            case "5.13a":
                return 13*increment;
            case "5.13b":
                return 14*increment;
            case "5.13c":
                return 15*increment;
            case "5.13d":
                return 16*increment;
            case "5.14a":
                return 17*increment;
            case "5.14b":
                return 18*increment;
            case "5.14c":
                return 19*increment;
            case "5.14d":
                return 20*increment;
            case "5.15a":
                return 21*increment;
            case "5.15b":
                return 22*increment;
            case "5.15c":
                return 23*increment;
            case "5.15d":
                return 24*increment;
            default:
                //lower than 5.10 return 0
                return 0;
        }
    }
}
