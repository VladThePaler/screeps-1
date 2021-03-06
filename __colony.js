var __Colony = {

    getRoom_Level: function(room) {
        if (room.energyCapacityAvailable < 550)           // lvl 1, 300 energy
            return 1;
        else if (room.energyCapacityAvailable < 800)      // lvl 2, 550 energy
            return 2;
        else if (room.energyCapacityAvailable < 1300)     // lvl 3, 800 energy
            return 3;
        else if (room.energyCapacityAvailable < 1800)     // lvl 4, 1300 energy
            return 4;
        else if (room.energyCapacityAvailable < 2300)     // lvl 5, 1800 energy
            return 5;
        else if (room.energyCapacityAvailable < 5300)     // lvl 6, 2300 energy
            return 6;
        else if (room.energyCapacityAvailable < 12300)    // lvl 7, 5300 energy
            return 7;
        else if (room.energyCapacityAvailable == 12300)   // lvl 8, 12300 energy
            return 8;
		},
        
    repairWalls_Critical: function(level) {
        var t = [0, 
                    1000,
                    2500,
                    5000,
                    10000,
                    15000,
                    30000,
                    60000,
                    100000 ];
        return t[level];
		},

    repairWalls_Maintenance: function(level) {
        var t = [0, 
                    10000,
                    25000,
                    35000,
                    50000,
                    750000,
                    100000,
                    150000,
                    300000 ];
        return t[level];
		},

    findByNeed_RepairCritical: function(room) {
        return room.find(FIND_STRUCTURES, {
                            filter: function(structure) {
                                return (structure.structureType == STRUCTURE_RAMPART && structure.hits < __Colony.repairWalls_Critical(__Colony.getRoom_Level(room)))
                                    || (structure.structureType == STRUCTURE_WALL && structure.hits < __Colony.repairWalls_Critical(__Colony.getRoom_Level(room)))
                                    || (structure.structureType == STRUCTURE_CONTAINER && structure.hits < structure.hitsMax * 0.2)
                                    || (structure.structureType == STRUCTURE_ROAD && structure.hits < structure.hitsMax * 0.2);
                            }}).sort(function(a, b) {return a.hits - b.hits});    
    },
    
    findByNeed_RepairMaintenance: function(room) {
        return room.find(FIND_STRUCTURES, {
                            filter: function(structure) {
                                return (structure.structureType == STRUCTURE_RAMPART && structure.hits < __Colony.repairWalls_Maintenance(__Colony.getRoom_Level(room)))
                                    || (structure.structureType == STRUCTURE_WALL && structure.hits < __Colony.repairWalls_Maintenance(__Colony.getRoom_Level(room)))
                                    || (structure.structureType == STRUCTURE_CONTAINER && structure.hits < structure.hitsMax * 0.8)
                                    || (structure.structureType == STRUCTURE_ROAD && structure.hits < structure.hitsMax * 0.8);
                            }}).sort(function(a, b) {return a.hits - b.hits});        
    },

    findByRange_RepairMaintenance: function(creep) {
        return creep.pos.findClosestByRange(FIND_STRUCTURES, {
                                filter: function(structure) {
                                    return (structure.structureType == STRUCTURE_ROAD && structure.hits < structure.hitsMax * 0.8)
                                        || (structure.structureType == STRUCTURE_CONTAINER && structure.hits < structure.hitsMax * 0.8)
                                        || (structure.structureType == STRUCTURE_RAMPART && structure.hits < __Colony.repairWalls_Maintenance(__Colony.getRoom_Level(creep.room)))
                                        || (structure.structureType == STRUCTURE_WALL && structure.hits < __Colony.repairWalls_Maintenance(__Colony.getRoom_Level(creep.room)));
                                } 
                        });
    }
};

module.exports = __Colony;
