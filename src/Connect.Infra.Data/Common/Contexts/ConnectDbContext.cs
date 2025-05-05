using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Connect;

public class ConnectDbContext(DbContextOptions<ConnectDbContext> options) : DbContext(options)
{
    public DbSet<AccountDao> Accounts { get; set; }
    public DbSet<ChannelPartnerDao> ChannelPartners { get; set; }
    
    public IQueryable<T> ReadOnlySet<T>() where T : class =>
        Set<T>().AsNoTracking();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AccountDao>(entity =>
        {
            entity.ToTable("account");

            entity.HasKey(e => e.Id);

            entity.Property(e => e.EmailId)
                .IsRequired()
                .HasMaxLength(256);

            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(256);

            // Store enums as strings
            entity.Property(e => e.Group)
                .HasConversion<string>()
                .IsRequired();

            entity.Property(e => e.State)
                .HasConversion<string>()
                .IsRequired();
            
            entity.OwnsOne(e => e.Password, pw =>
            {
                pw.Property(p => p.Salt).HasColumnName("PasswordSalt").IsRequired();
                pw.Property(p => p.Hash).HasColumnName("PasswordHash").IsRequired();
                pw.Property(p => p.IterationCount).HasColumnName("PasswordIterations").IsRequired();
                pw.Property(p => p.UpdateTime).HasColumnName("PasswordUpdated").IsRequired();
            });

            // Map Auth record as owned type
            entity.OwnsOne(e => e.Auth, auth =>
            {
                auth.Property(a => a.Token).HasColumnName("AuthToken").IsRequired();
                auth.Property(a => a.CreateTime).HasColumnName("AuthCreated").IsRequired();
            });
        });
        
        modelBuilder.Entity<ChannelPartnerDao>(entity =>
        {
            entity.ToTable("channel_partner");

            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id)
                .HasColumnName("id")
                .ValueGeneratedOnAdd();

            entity.Property(e => e.Name)
                .HasColumnName("name")
                .HasMaxLength(255)
                .IsRequired();
        });
        
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            // Only apply to types that inherit from BaseEntity
            if (!typeof(BaseEntity).IsAssignableFrom(entityType.ClrType)) 
                continue;
            
            modelBuilder.Entity(entityType.ClrType).Property<DateTime>("CreatedAt").IsRequired();
            modelBuilder.Entity(entityType.ClrType).Property<DateTime>("UpdatedAt").IsRequired();
        }
    }
    
    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var entries = ChangeTracker
            .Entries<BaseEntity>()
            .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified);

        var now = DateTime.UtcNow;

        foreach (var entry in entries)
        {
            if (entry.State == EntityState.Added)
                entry.Entity.CreatedAt = now;

            entry.Entity.UpdatedAt = now;
        }

        return await base.SaveChangesAsync(cancellationToken);
    }
}