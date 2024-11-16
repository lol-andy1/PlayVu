package com.playvu.backend.repository;



import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.playvu.backend.entity.Field;

@Repository
public interface FieldRepository extends JpaRepository<Field, Integer> {
    
    @Query(value = "SELECT field_id " +
                   "FROM field " +
                   "WHERE (6371 * acos(cos(radians(:latitude)) * cos(radians(latitude)) * " +
                   "cos(radians(longitude) - radians(:longitude)) + " +
                   "sin(radians(:latitude)) * sin(radians(latitude)))) < :distance " +
                   "ORDER BY (6371 * acos(cos(radians(:latitude)) * cos(radians(latitude)) * " +
                   "cos(radians(longitude) - radians(:longitude)) + " +
                   "sin(radians(:latitude)) * sin(radians(latitude)))) " +
                   "LIMIT 10", 
           nativeQuery = true)
    List<Integer> findNearestFields(@Param("latitude") Float latitude, @Param("longitude") Float longitude, @Param("distance") Float distance);

    @Query(value = "SELECT f.name AS \"fieldName\", f.address AS \"address\", f.zip_code AS \"zipCode\", f.city AS \"city\", f.field_id AS \"fieldId\" FROM field f WHERE f.owner_id = :ownerId", nativeQuery = true)
    List < Map<String, Object> > findByOwnerId(@Param("ownerId") Integer ownerId);

    @Query(value = "SELECT f.name AS \"fieldName\", f.address AS \"address\", f.zip_code AS \"zipCode\", f.city AS \"city\", f.field_id AS \"fieldId\" FROM field f WHERE f.name ILIKE %:name%", nativeQuery = true)
    List<Map<String, Object>> findFieldsByName(@Param("name") String name);
}
    