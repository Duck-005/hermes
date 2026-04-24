package com.example.chatapp.repository;

import com.example.chatapp.model.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    
    @Query("SELECT m FROM Message m WHERE (m.sender = :user1 AND m.recipient = :user2) OR (m.sender = :user2 AND m.recipient = :user1) ORDER BY m.timestamp DESC")
    Page<Message> findPrivateMessages(@Param("user1") String user1, @Param("user2") String user2, Pageable pageable);

    @Query("""
        SELECT m
        FROM Message m
        WHERE (m.sender = :currentUser OR m.recipient = :currentUser)
          AND m.recipient <> 'GROUP'
        ORDER BY m.timestamp DESC
    """)
    List<Message> findPrivateMessagesForUser(@Param("currentUser") String currentUser);

    Page<Message> findAllByRoomIdOrderByTimestampDesc(String roomId, Pageable pageable);

    List<Message> findBySenderAndRecipient(String sender, String recipient);
    List<Message> findByRecipient(String recipient);
}
