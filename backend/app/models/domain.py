import uuid
from sqlalchemy import Column, String, Float, Integer, Boolean, ForeignKey, DateTime, Date, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.session import Base

class Junction(Base):
    __tablename__ = "junctions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, index=True)
    zone = Column(String, index=True)
    lat = Column(Float)
    lng = Column(Float)
    road_class = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    risk_scores = relationship("RiskScore", back_populates="junction", cascade="all, delete-orphan")
    incidents = relationship("Incident", back_populates="junction")
    deployments = relationship("Deployment", back_populates="junction")

class RiskScore(Base):
    __tablename__ = "risk_scores"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    junction_id = Column(UUID(as_uuid=True), ForeignKey("junctions.id"))
    score = Column(Numeric(5, 2))
    nl_explanation = Column(String)
    computed_at = Column(DateTime, default=datetime.utcnow, index=True)

    junction = relationship("Junction", back_populates="risk_scores")
    factors = relationship("ScoreFactor", back_populates="risk_score", cascade="all, delete-orphan")

class ScoreFactor(Base):
    __tablename__ = "score_factors"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    risk_score_id = Column(UUID(as_uuid=True), ForeignKey("risk_scores.id"))
    factor_name = Column(String)
    raw_value = Column(Float)
    weight = Column(Float)
    contribution = Column(Float)

    risk_score = relationship("RiskScore", back_populates="factors")

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    junction_id = Column(UUID(as_uuid=True), ForeignKey("junctions.id"))
    type = Column(String)
    severity = Column(Integer)
    reported_at = Column(DateTime, default=datetime.utcnow)
    simulated = Column(Boolean, default=True)

    junction = relationship("Junction", back_populates="incidents")

class Officer(Base):
    __tablename__ = "officers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String)
    zone = Column(String)
    current_lat = Column(Float)
    current_lng = Column(Float)
    shift = Column(String)
    available = Column(Boolean, default=True)

    deployments = relationship("Deployment", back_populates="officer")

class Deployment(Base):
    __tablename__ = "deployments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    junction_id = Column(UUID(as_uuid=True), ForeignKey("junctions.id"))
    officer_id = Column(UUID(as_uuid=True), ForeignKey("officers.id"), nullable=True)
    status = Column(String) # recommended, accepted, modified, rejected
    source = Column(String) # optimizer, manual
    assigned_at = Column(DateTime, default=datetime.utcnow)

    junction = relationship("Junction", back_populates="deployments")
    officer = relationship("Officer", back_populates="deployments")
    audit_logs = relationship("AuditLog", back_populates="deployment")

class Operator(Base):
    __tablename__ = "operators"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String)
    role = Column(String)

class AuditLog(Base):
    __tablename__ = "audit_log"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    deployment_id = Column(UUID(as_uuid=True), ForeignKey("deployments.id"))
    operator_id = Column(UUID(as_uuid=True), ForeignKey("operators.id"))
    action = Column(String)
    reason = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    deployment = relationship("Deployment", back_populates="audit_logs")
